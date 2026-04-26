import { getKnowledgeBase, createAppointment, getAppointments } from './mockDatabase';

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

  const systemPrompt = `Je bent de virtuele assistent van 'BPM Parket', dé specialist in traditioneel parket, PVC vloeren en traprenovatie gevestigd in Geldrop.
Je spreekt Nederlands. Wees professioneel, behulpzaam en enthousiast over vakmanschap.
Je bent gespecialiseerd in het leggen van traditioneel parket (met band en bies), multiplanken, PVC, laminaat en traprenovatie. Ook voor schuren en onderhoud kunnen mensen bij ons terecht.
Gebruik de onderstaande kennisbank om vragen te beantwoorden. Als je het antwoord niet weet, zeg dan dat een medewerker contact op zal nemen.
Verzin geen feiten buiten deze context of algemene kennis over houtbewerking en parket.

KENNISBANK:
${contextText}

Als een klant een afspraak wil maken of een offerte wil, vraag dan om naam, email en voorkeursdatum. Gebruik de 'bookAppointment' tool als je alle info hebt.
Controleer eerst beschikbaarheid als de klant een specifieke datum noemt.`;

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
