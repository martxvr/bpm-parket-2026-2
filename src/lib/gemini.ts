/**
 * @deprecated Gemini provider is no longer used. The chatbot now uses Claude Haiku via @anthropic-ai/sdk.
 * This file is kept for reference only. See src/app/api/chat/route.ts for the current implementation.
 */

import { GoogleGenerativeAI, Tool, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export const appointmentsTool: Tool = {
    functionDeclarations: [
        {
            name: "check_availability",
            description: "Controleer welke tijden al bezet zijn voor een specifieke datum om de klant vrije sloten voor te stellen.",
            parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    date: {
                        type: SchemaType.STRING,
                        description: "De datum in YYYY-MM-DD formaat",
                    },
                },
                required: ["date"],
            },
        },
        {
            name: "create_appointment",
            description: "Maak een nieuwe afspraak in de showroom nadat alle benodigde gegevens zijn verzameld.",
            parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    name: {
                        type: SchemaType.STRING,
                        description: "De volledige naam van de klant",
                    },
                    phone: {
                        type: SchemaType.STRING,
                        description: "Het telefoonnummer van de klant",
                    },
                    email: {
                        type: SchemaType.STRING,
                        description: "Het e-mailadres van de klant (optioneel)",
                    },
                    date: {
                        type: SchemaType.STRING,
                        description: "De datum van de afspraak (YYYY-MM-DD)",
                    },
                    time: {
                        type: SchemaType.STRING,
                        description: "De tijd van de afspraak (HH:MM)",
                    },
                    service: {
                        type: SchemaType.STRING,
                        description: "Het type afspraak. Kies uit: 'pvc-vloeren', 'traprenovatie', 'vloerbedekking', 'raamdecoratie', 'gordijnen', 'anders'. Gebruik 'anders' als het er niet bij staat.",
                    },
                },
                required: ["name", "phone", "date", "time", "service"],
            },
        },
    ],
};

export function getGeminiModel() {
    return genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite-preview",
        tools: [appointmentsTool],
    });
}
