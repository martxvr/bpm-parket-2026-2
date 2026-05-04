import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { getKnowledgeBase, createAppointment, getAppointments } from './mockDatabase';
import { Appointment } from '../types';

// Define the tool for booking
const bookAppointmentTool: FunctionDeclaration = {
    name: 'bookAppointment',
    description: 'Boek een afspraak voor een inspectie of adviesgesprek.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            customerName: { type: Type.STRING, description: 'Naam van de klant' },
            customerEmail: { type: Type.STRING, description: 'Email adres van de klant' },
            date: { type: Type.STRING, description: 'Gewenste datum en tijd (ISO format of beschrijving, bijv 2024-05-20T10:00)' },
            notes: { type: Type.STRING, description: 'Onderwerp van de afspraak' }
        },
        required: ['customerName', 'customerEmail', 'date']
    }
};

const checkAvailabilityTool: FunctionDeclaration = {
    name: 'checkAvailability',
    description: 'Controleer of een specifiek tijdstip beschikbaar is.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            date: { type: Type.STRING, description: 'De datum om te checken (YYYY-MM-DD)' }
        },
        required: ['date']
    }
}

export const sendMessageToGemini = async (
    history: { role: string; parts: { text: string }[] }[],
    message: string,
    onToolCall?: (toolName: string, args: any) => Promise<any>
): Promise<string> => {

    if (!process.env.API_KEY) {
        return "Ik kan momenteel niet antwoorden omdat de API key ontbreekt. Configureer dit in de code.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 1. Fetch Knowledge Base to inject as system context
    const knowledgeItems = await getKnowledgeBase();
    const contextText = knowledgeItems.map(k => `[${k.topic}]: ${k.content}`).join('\n');

    const systemInstruction = `
    Je bent de virtuele assistent van 'BPM Parket', dé specialist in traditioneel parket, PVC vloeren en traprenovatie gevestigd in Geldrop. 
    Je spreekt Nederlands. Wees professioneel, behulpzaam en enthousiast over vakmanschap.
    
    Je bent gespecialiseerd in het leggen van traditioneel parket (met band en bies), multiplanken, PVC, laminaat en traprenovatie. Ook voor schuren en onderhoud kunnen mensen bij ons terecht.
    
    Gebruik de onderstaande kennisbank om vragen te beantwoorden. Als je het antwoord niet weet, zeg dan dat een medewerker contact op zal nemen.
    Verzin geen feiten buiten deze context of algemene kennis over houtbewerking en parket.
    
    KENNISBANK:
    ${contextText}
    
    Als een klant een afspraak wil maken of een offerte wil voor parket of traprenovatie, vraag dan om naam, email en voorkeursdatum. Gebruik de 'bookAppointment' tool als je alle info hebt.
    Controleer eerst beschikbaarheid als de klant een specifieke datum noemt.
  `;

    try {
        // Updated to a valid model name for basic text tasks
        const model = 'gemini-3-flash-preview';
        const chat = ai.chats.create({
            model: model,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ functionDeclarations: [bookAppointmentTool, checkAvailabilityTool] }],
            },
            history: history.map(h => ({
                role: h.role,
                parts: h.parts
            }))
        });

        const response = await chat.sendMessage({ message });

        // Handle Function Calls
        if (response.functionCalls && response.functionCalls.length > 0) {
            // We iterate through function calls if there are multiple, though usually one per turn in simple chat
            // The previous code only handled the first one [0]. Let's stick to that for simplicity or handle loop if needed.
            // For robustness, let's handle the first one and return.
            const call = response.functionCalls[0];
            const args = call.args;

            let toolResult = "";

            if (call.name === 'bookAppointment') {
                await createAppointment({
                    customerName: args.customerName as string,
                    customerEmail: args.customerEmail as string,
                    date: args.date as string,
                    notes: (args.notes as string) || 'Afspraak via chatbot',
                    source: 'chatbot'
                });
                toolResult = `Afspraak succesvol geboekt voor ${args.date}. Bevestig dit aan de gebruiker.`;
            } else if (call.name === 'checkAvailability') {
                const appointments = await getAppointments();
                // Ensure date exists
                if (args.date) {
                    const dateStr = (args.date as string).split('T')[0];
                    const count = appointments.filter(a => a.date.startsWith(dateStr)).length;
                    if (count > 3) {
                        toolResult = "Helaas zit deze dag vol. Stel een andere dag voor.";
                    } else {
                        toolResult = "Deze dag is beschikbaar.";
                    }
                } else {
                    toolResult = "Geen datum opgegeven.";
                }
            }

            // Send tool result back to model to get final natural language response
            const finalResult = await chat.sendMessage({
                message: [{
                    functionResponse: {
                        name: call.name,
                        response: { result: toolResult }
                    }
                }]
            });

            return finalResult.text || "Er is iets misgegaan bij het verwerken van de actie.";
        }

        return response.text || "Sorry, ik begreep dat niet helemaal.";

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Er is een tijdelijke fout opgetreden in mijn brein. Probeer het later nog eens.";
    }
};