import { getKnowledgeBase, createAppointment, getAppointments } from './mockDatabase';
import { companyConfig } from '../config';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string;
const MODEL = 'claude-haiku-4-5-20251001';

const tools = [
  {
    name: 'bookAppointment',
    description: 'Boek een afspraak voor een inspectie of adviesgesprek.',
    input_schema: {
      type: 'object',
      properties: {
        customerName: { type: 'string', description: 'Naam van de klant' },
        customerEmail: { type: 'string', description: 'Email adres van de klant' },
        date: { type: 'string', description: 'Gewenste datum en tijd (bijv. 2024-05-20T10:00)' },
        notes: { type: 'string', description: 'Onderwerp van de afspraak' },
      },
      required: ['customerName', 'customerEmail', 'date'],
    },
  },
  {
    name: 'checkAvailability',
    description: 'Controleer of een specifiek tijdstip beschikbaar is.',
    input_schema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'De datum om te checken (YYYY-MM-DD)' },
      },
      required: ['date'],
    },
  },
];

export const sendMessageToClaude = async (
  history: { role: string; text: string }[],
  message: string
): Promise<string> => {
  if (!API_KEY) {
    return 'API key ontbreekt. Voeg VITE_ANTHROPIC_API_KEY toe aan .env.local en herstart de server.';
  }

  const knowledgeItems = await getKnowledgeBase();
  const contextText = knowledgeItems.map(k => `[${k.topic}]: ${k.content}`).join('\n');

  const phone = companyConfig.contact.phone;
  const address = `${companyConfig.contact.address}, ${companyConfig.contact.zipCity}`;

  const systemPrompt = `Je bent een vriendelijke, korte assistent van BPM Parket. Je HOOFDDOEL is om bezoekers naar onze SHOWROOM in Geldrop te krijgen (${address}). Een showroombezoek is altijd de beste route — daar kunnen ze de vloeren zelf zien en voelen. Bellen naar ${phone} is een goede tweede optie.

COMMUNICATIESTIJL:
- Informeel Nederlands (je/jij), warm en persoonlijk.
- KORT: maximaal 2-3 zinnen per antwoord. Nooit lange opsommingen.
- Stel maximaal één vraag per bericht.
- Gebruik NOOIT emoji's in je antwoorden.

WAT JE WEL BEANTWOORDT (kort en bondig):
- Locatie: ${address}.
- Welke diensten wij aanbieden (traditioneel parket met band en bies, multiplanken, PVC vloeren, laminaat, traprenovatie, schuren en onderhoud).
- Heel simpele ja/nee vragen.
- Een showroomafspraak inplannen via de tools.
- Gebruik de KENNISBANK hieronder voor specifieke vragen (openingstijden, materialen, e.d.).

WAT JE DOORVERWIJST NAAR SHOWROOMBEZOEK OF BELLEN:
- Prijsvragen → "Voor een eerlijke prijsindicatie laten we je graag de vloeren in het echt zien. Zal ik een afspraak in onze showroom in Geldrop inplannen? Bellen kan ook: ${phone}."
- Technische vloeradviezen → "Goed dat je dit vraagt! Onze vakmensen leggen het je het beste persoonlijk uit in de showroom. Zal ik een afspraak voor je inplannen?"
- Specifieke productvragen → "In de showroom kun je [product] zelf zien en voelen. Zal ik een afspraak inplannen, of liever even bellen met ${phone}?"
- Offertes → "Een offerte maken we graag op maat na een showroombezoek of inmeting. Zal ik een afspraak voor je inplannen?"
- Klachten of problemen → "Vervelend om te horen! Bel even naar ${phone}, dan zoeken we samen naar een oplossing."
- Alles wat meer is dan een basisfeitje → vriendelijk doorverwijzen naar showroom of bellen.

AFSPRAAK INPLANNEN (showroombezoek):
1. Vraag de naam.
2. Vraag de gewenste datum & tijd. Gebruik ALTIJD eerst 'checkAvailability' om te checken.
3. Vraag het emailadres.
4. Optioneel: onderwerp van de afspraak.
5. Bevestig en gebruik 'bookAppointment'.
6. Zeg: "Top, je showroomafspraak staat! Je ontvangt een bevestiging per mail. Tot snel in Geldrop."

BELANGRIJK:
- Verwijs bij ELKE complexere vraag vriendelijk naar een showroombezoek (of bellen als alternatief). Maak het een positieve suggestie, nooit opdringerig.
- Geef NOOIT prijzen, ook niet als indicatie.
- Verzin geen feiten buiten de kennisbank of algemene kennis over houtbewerking en parket.
- De huidige datum is: ${new Date().toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

KENNISBANK:
${contextText}`;

  const messages = [
    ...history.map(h => ({
      role: h.role === 'model' ? 'assistant' : 'user',
      content: h.text,
    })),
    { role: 'user', content: message },
  ];

  const callClaude = async (msgs: { role: string; content: any }[]) => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        tools,
        messages: msgs,
      }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
  };

  try {
    const data = await callClaude(messages);

    if (data.stop_reason === 'tool_use') {
      const toolUse = data.content.find((b: any) => b.type === 'tool_use');
      if (!toolUse) return 'Er is iets misgegaan.';

      let toolResult = '';
      if (toolUse.name === 'bookAppointment') {
        await createAppointment({
          customerName: toolUse.input.customerName,
          customerEmail: toolUse.input.customerEmail,
          date: toolUse.input.date,
          notes: toolUse.input.notes || 'Afspraak via chatbot',
          source: 'chatbot',
        });
        toolResult = `Afspraak succesvol geboekt voor ${toolUse.input.date}. Bevestig dit aan de gebruiker.`;
      } else if (toolUse.name === 'checkAvailability') {
        const appointments = await getAppointments();
        const dateStr = (toolUse.input.date as string).split('T')[0];
        const count = appointments.filter((a: any) => a.date.startsWith(dateStr)).length;
        toolResult = count > 3 ? 'Helaas zit deze dag vol. Stel een andere dag voor.' : 'Deze dag is beschikbaar.';
      }

      const followUp = await callClaude([
        ...messages,
        { role: 'assistant', content: data.content },
        {
          role: 'user',
          content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: toolResult }],
        },
      ]);

      const textBlock = followUp.content.find((b: any) => b.type === 'text');
      return textBlock?.text || 'Afspraak verwerkt.';
    }

    const textBlock = data.content.find((b: any) => b.type === 'text');
    return textBlock?.text || 'Sorry, ik begreep dat niet helemaal.';
  } catch (error) {
    console.error('Claude API error:', error);
    return 'Er is een tijdelijke fout opgetreden. Probeer het later nog eens.';
  }
};
