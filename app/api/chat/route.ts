import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { render } from '@react-email/render';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '@/lib/env';
import { chatRequestSchema } from '@/lib/validation/chat';
import { rateLimit } from '@/lib/rate-limit';
import { hashIdentifier } from '@/lib/hash';
import { getKnowledge } from '@/lib/db/knowledge';
import { getAdminSettings } from '@/lib/db/admin-settings';
import {
  insertAppointment,
  countAppointmentsForDate,
} from '@/lib/db/appointments';
import { sendEmail, ADMIN_EMAIL } from '@/lib/resend';
import { AppointmentConfirmation } from '@/components/emails/transactional/AppointmentConfirmation';
import { AdminAppointmentNotification } from '@/components/emails/transactional/AdminAppointmentNotification';
import { companyConfig } from '@/lib/company';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_LOOP_ITERATIONS = 5;

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'bookAppointment',
    description: 'Boek een showroomafspraak voor een bezoeker.',
    input_schema: {
      type: 'object',
      properties: {
        customerName: { type: 'string' },
        customerEmail: { type: 'string' },
        datetime: { type: 'string', description: 'ISO datetime' },
        notes: { type: 'string' },
      },
      required: ['customerName', 'customerEmail', 'datetime'],
    },
  },
  {
    name: 'checkAvailability',
    description: 'Controleer of er nog plek is op een specifieke datum.',
    input_schema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'YYYY-MM-DD' },
      },
      required: ['date'],
    },
  },
];

export async function POST(req: NextRequest) {
  if (!env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Chatbot is currently disabled.' },
      { status: 503 },
    );
  }

  const headerStore = await headers();
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  const body = await req.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { history, message, sessionId } = parsed.data;

  const rl = await rateLimit(`chat:${ip}:${sessionId}`, 30, 10 * 60);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          'Even rustig — je hebt veel berichten gestuurd. Probeer over een paar minuten opnieuw.',
      },
      { status: 429 },
    );
  }

  const settings = await getAdminSettings().catch(() => null);
  if (settings && !settings.chatbot_enabled) {
    return NextResponse.json({
      text: `De chatbot staat momenteel uit. Bel ons gerust op ${companyConfig.contact.phone}.`,
    });
  }

  const knowledge = await getKnowledge();
  const knowledgeText = knowledge
    .map((k) => `[${k.topic}]: ${k.content}`)
    .join('\n');

  const adminExtra = settings?.system_prompt_extra
    ? `\n\nEXTRA INSTRUCTIES VANUIT ADMIN:\n${settings.system_prompt_extra}\n`
    : '';

  const phone = settings?.phone || companyConfig.contact.phone;
  const address = `${companyConfig.contact.address}, ${companyConfig.contact.zipCity}`;
  const today = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const systemPrompt = `Je bent een vriendelijke, korte assistent van BPM Parket. Je HOOFDDOEL is om bezoekers naar onze SHOWROOM in Geldrop te krijgen (${address}). Bellen naar ${phone} is een goede tweede optie.

COMMUNICATIESTIJL:
- Informeel Nederlands (je/jij), warm en persoonlijk.
- KORT: maximaal 2-3 zinnen per antwoord. Nooit lange opsommingen.
- Stel maximaal één vraag per bericht.
- Gebruik NOOIT emoji's.

WAT JE BEANTWOORDT:
- Locatie: ${address}.
- Diensten: traditioneel parket (band en bies), multiplanken, PVC, laminaat, traprenovatie, schuren en onderhoud.
- Heel simpele ja/nee vragen.
- Showroomafspraak inplannen via tools.

WAT JE DOORVERWIJST:
- Prijsvragen → "Voor een eerlijke prijsindicatie laten we je graag de vloeren in het echt zien. Zal ik een afspraak inplannen?"
- Technisch advies → "Onze vakmensen leggen het je het beste persoonlijk uit. Zal ik een afspraak inplannen?"
- Klachten → "Bel even ${phone}, dan zoeken we samen een oplossing."

AFSPRAAK INPLANNEN:
1. Vraag naam.
2. Vraag datum & tijd. Gebruik ALTIJD eerst checkAvailability.
3. Vraag emailadres.
4. Optioneel notities.
5. Bevestig en gebruik bookAppointment.

Geef NOOIT prijzen. Verzin geen feiten buiten de kennisbank.

Datum vandaag: ${today}.${adminExtra}

KENNISBANK:
${knowledgeText}`;

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

  const messages: Anthropic.MessageParam[] = [
    ...history.map((h) => ({
      role: h.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: h.text,
    })),
    { role: 'user' as const, content: message },
  ];

  for (let i = 0; i < MAX_LOOP_ITERATIONS; i++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      tools: TOOLS,
      messages,
    });

    if (response.stop_reason === 'end_turn' || response.stop_reason === 'max_tokens') {
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('\n');
      return NextResponse.json({ text });
    }

    if (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
      );

      messages.push({ role: 'assistant', content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const tool of toolUseBlocks) {
        let result: string;

        if (tool.name === 'checkAvailability') {
          const input = tool.input as { date: string };
          const count = await countAppointmentsForDate(input.date);
          result =
            count > 3
              ? 'Helaas zit deze dag vol. Stel een andere dag voor.'
              : 'Deze dag is beschikbaar.';
        } else if (tool.name === 'bookAppointment') {
          const input = tool.input as {
            customerName: string;
            customerEmail: string;
            datetime: string;
            notes?: string;
          };
          await insertAppointment({
            customer_name: input.customerName,
            customer_email: input.customerEmail,
            date: input.datetime,
            notes: input.notes,
            source: 'chatbot',
            ip_hash: hashIdentifier(ip),
          });

          await Promise.all([
            sendEmail({
              to: input.customerEmail,
              subject: 'Showroomafspraak bevestigd — BPM Parket',
              html: await render(
                AppointmentConfirmation({
                  name: input.customerName,
                  date: input.datetime,
                }),
              ),
            }).catch((e) =>
              console.error('Appointment confirmation email failed:', e),
            ),
            sendEmail({
              to: ADMIN_EMAIL,
              replyTo: input.customerEmail,
              subject: `Nieuwe afspraak: ${input.customerName}`,
              html: await render(
                AdminAppointmentNotification({
                  name: input.customerName,
                  email: input.customerEmail,
                  date: input.datetime,
                  notes: input.notes,
                  source: 'chatbot',
                }),
              ),
            }).catch((e) =>
              console.error('Admin appointment notification failed:', e),
            ),
          ]);

          result = `Afspraak geboekt voor ${input.datetime}. Bevestig dit aan de gebruiker.`;
        } else {
          result = 'Onbekende tool';
        }

        toolResults.push({
          type: 'tool_result',
          tool_use_id: tool.id,
          content: result,
        });
      }

      messages.push({ role: 'user', content: toolResults });
    } else {
      return NextResponse.json({
        text:
          'Sorry, ik begreep dat niet helemaal. Probeer het anders te formuleren?',
      });
    }
  }

  return NextResponse.json({
    text: `Ik heb wat moeite met deze vraag. Bel ons even op ${phone}.`,
  });
}
