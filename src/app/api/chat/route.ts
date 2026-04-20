import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getChatbotSettings, getKennisItems, getBedrijfsgegevens, getProjects } from '@/lib/site-data';
import { checkAvailability, createAppointmentTool } from './chat-actions';

// Simple in-memory rate limiter: 15 requests per minute per IP
const rateLimitStore = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(ip);
    if (!entry || now > entry.reset) {
        rateLimitStore.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
        return true;
    }
    if (entry.count >= RATE_LIMIT) return false;
    entry.count++;
    return true;
}

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const tools: Anthropic.Tool[] = [
    {
        name: "check_availability",
        description: "Controleer welke tijden al bezet zijn voor een specifieke datum om de klant vrije sloten voor te stellen.",
        input_schema: {
            type: "object" as const,
            properties: {
                date: {
                    type: "string",
                    description: "De datum in YYYY-MM-DD formaat",
                },
            },
            required: ["date"],
        },
    },
    {
        name: "create_appointment",
        description: "Maak een nieuwe afspraak in de showroom nadat alle benodigde gegevens zijn verzameld.",
        input_schema: {
            type: "object" as const,
            properties: {
                name: { type: "string", description: "De volledige naam van de klant" },
                phone: { type: "string", description: "Het telefoonnummer van de klant" },
                email: { type: "string", description: "Het e-mailadres van de klant (optioneel)" },
                date: { type: "string", description: "De datum van de afspraak (YYYY-MM-DD)" },
                time: { type: "string", description: "De tijd van de afspraak (HH:MM)" },
                service: { type: "string", description: "Het type afspraak: 'pvc-vloeren', 'traprenovatie', 'vloerbedekking', 'raamdecoratie', 'gordijnen', of 'anders'" },
            },
            required: ["name", "phone", "date", "time", "service"],
        },
    },
];

export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: 'Te veel verzoeken. Probeer het over een minuut opnieuw.' }, { status: 429 });
    }

    try {
        const { messages: history, message } = await req.json();

        // 1. Fetch all necessary context & settings
        const [settings, knowledgeItems, companyData, projects] = await Promise.all([
            getChatbotSettings(),
            getKennisItems(),
            getBedrijfsgegevens(),
            getProjects(5)
        ]);

        if (!settings || settings.enabled === false) {
            return NextResponse.json({ content: "De chatbot is momenteel uitgeschakeld." });
        }

        // 2. Build context
        const knowledgeBase = knowledgeItems.map(item =>
            `- ${item.title}: ${item.content}`
        ).join('\n');

        const projectContext = projects.map(p =>
            `- ${p.title} (${p.category}): ${p.description}`
        ).join('\n');

        const phone = companyData?.phone || '0314-123456';

        const companyInfo = `
BEDRIJFSGEGEVENS:
- Naam: ${companyData?.name || 'PVC Vloeren Achterhoek'}
- Adres: ${companyData?.address || ''}, ${companyData?.postcode || ''} ${companyData?.city || ''}
- Telefoon: ${phone}
- Email: ${companyData?.email || ''}

DIENSTEN & RECENTE PROJECTEN:
${projectContext}

VEELGESTELDE VRAGEN & KENNISBANK:
${knowledgeBase}
        `;

        // 3. System prompt — focus on driving phone calls
        const systemPrompt = `Je bent een vriendelijke, korte assistent van PVC Vloeren Achterhoek. Je HOOFDDOEL is om bezoekers te laten BELLEN naar ${phone}.

COMMUNICATIESTIJL:
- Informeel Nederlands (je/jij), warm en persoonlijk.
- KORT: maximaal 2-3 zinnen per antwoord. Nooit lange opsommingen.
- Stel maximaal één vraag per bericht.
- Gebruik NOOIT emoji's in je antwoorden.

WAT JE WEL BEANTWOORDT (kort en bondig):
- Openingstijden: Ma 13-17, Di 10-17, Wo 12-17, Do 10-17, Vr 10-17, Za 9-15, Zo gesloten.
- Locatie: Logistiekweg 20-32, Doetinchem.
- Welke diensten jullie aanbieden (PVC-vloeren, traprenovatie, vloerbedekking, raamdecoratie, gordijnen).
- Heel simpele ja/nee vragen ("Zijn jullie open op zaterdag?" → "Ja, van 9 tot 15 uur!").
- Een showroomafspraak inplannen via de tools.

WAT JE DOORVERWIJST NAAR BELLEN:
- Prijsvragen → "Voor een accurate prijsindicatie kan ik je het beste doorverbinden met een adviseur. Bel gerust naar ${phone}, dan helpen ze je direct!"
- Technische vloeradviezen → "Dat is een goede vraag! Onze specialisten kunnen je daar het beste bij helpen. Bel even naar ${phone} voor persoonlijk advies."
- Specifieke productvragen → "Om je het allerbeste advies te geven, raad ik je aan om even te bellen met ${phone}. Ze kunnen alles over [product] vertellen!"
- Offertes → "Een offerte maken we graag op maat! Bel ${phone} of kom langs in onze showroom, dan bespreken we alles."
- Klachten/problemen → "Vervelend om te horen! Bel even naar ${phone}, dan zoeken we samen naar een oplossing."
- Alles wat meer dan een basisfeitje is → belverwÿzing.

AFSPRAAK INPLANNEN:
Als iemand een afspraak wil, doe dan het volgende:
1. Vraag hun naam.
2. Vraag gewenste datum & tijd. Gebruik ALTIJD eerst 'check_availability' om te checken.
3. Vraag telefoonnummer.
4. Email (optioneel).
5. Bevestig en gebruik 'create_appointment'.
6. Zeg: "Top, je afspraak staat! Je ontvangt een bevestiging per mail."
Service categorieën: 'pvc-vloeren', 'traprenovatie', 'vloerbedekking', 'raamdecoratie', 'gordijnen', 'anders'.

BELANGRIJK:
- Verwijs bij ELKE complexere vraag vriendelijk naar bellen. Maak het makkelijk: noem altijd het nummer.
- Wees NOOIT opdringerig of onvriendelijk bij het doorverwijzen. Maak het een positieve suggestie.
- Geef NOOIT prijzen, ook niet als indicatie.
- De huidige datum is: ${new Date().toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

${settings.system_prompt ? `EXTRA INSTRUCTIES VANUIT ADMIN:\n${settings.system_prompt}` : ''}

BEDRIJFSCONTEXT:
${companyInfo}`;

        // 4. Map history to Claude format
        const claudeMessages: Anthropic.MessageParam[] = history
            .filter((msg: any) => msg.content || msg.text)
            .map((msg: any) => ({
                role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
                content: msg.content || msg.text || "",
            }));

        // Add current user message
        claudeMessages.push({ role: 'user', content: message });

        // Ensure first message is from user (Claude requirement)
        if (claudeMessages.length > 0 && claudeMessages[0].role !== 'user') {
            const firstUserIdx = claudeMessages.findIndex(m => m.role === 'user');
            if (firstUserIdx > 0) {
                claudeMessages.splice(0, firstUserIdx);
            }
        }

        // 5. Handle tool calling loop
        let currentMessages = [...claudeMessages];
        const MAX_ITERATIONS = 5;

        for (let i = 0; i < MAX_ITERATIONS; i++) {
            const response = await anthropic.messages.create({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 500,
                system: systemPrompt,
                tools,
                messages: currentMessages,
            });

            // Check if we have tool use
            const toolUseBlock = response.content.find(
                (block): block is Anthropic.ContentBlock & { type: 'tool_use' } => block.type === 'tool_use'
            );

            if (!toolUseBlock) {
                // No tool call — extract text response
                const textBlock = response.content.find(
                    (block): block is Anthropic.ContentBlock & { type: 'text' } => block.type === 'text'
                );
                const finalMessage = textBlock?.text || "Sorry, er is iets misgegaan.";
                return NextResponse.json({ content: finalMessage });
            }

            // Execute tool
            let toolResult: any;
            if (toolUseBlock.name === "check_availability") {
                const { date } = toolUseBlock.input as { date: string };
                toolResult = await checkAvailability(date);
            } else if (toolUseBlock.name === "create_appointment") {
                toolResult = await createAppointmentTool(toolUseBlock.input as any);
            }

            // Add assistant response + tool result to messages for next iteration
            currentMessages.push({
                role: 'assistant',
                content: response.content,
            });
            currentMessages.push({
                role: 'user',
                content: [{
                    type: 'tool_result',
                    tool_use_id: toolUseBlock.id,
                    content: JSON.stringify(toolResult || {}),
                }],
            });
        }

        // If we exhausted iterations, return last text
        return NextResponse.json({ content: "Sorry, er ging iets mis. Probeer het opnieuw of bel ons op " + phone + "." });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Interne serverfout" }, { status: 500 });
    }
}
