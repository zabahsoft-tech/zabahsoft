import { GoogleGenAI } from "@google/genai";
import { MOCK_SERVICES } from "../constants";

let aiClient: GoogleGenAI | null = null;

// Initialize the client safely
try {
  // Always initialize using new GoogleGenAI({ apiKey: process.env.API_KEY })
  if (process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } else {
    console.warn("Gemini API Key is missing. Chat features will fallback.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini client:", error);
}

const SYSTEM_INSTRUCTION = `
You are 'ZabahBot', the intelligent support assistant for ZabahSoft, a leading software company in Afghanistan.
Your goal is to help potential clients understand our services and navigate the platform.

Context about ZabahSoft:
- We offer Web Development, Database Solutions, and Custom Software.
- We accept payments via HessabPay (AFN) and Stripe (USD).
- We have a client portal for managing licenses and invoices.
- We also have Telegram and WhatsApp bot integrations.
- The website supports English, Farsi, and Pashto.

Available Services Data:
${JSON.stringify(MOCK_SERVICES.map(s => `${s.name} (${s.type}): $${s.price_usd} / ${s.price_afn} AFN`))}

Guidelines:
- Be professional, polite, and concise.
- If asked about prices, quote both USD and AFN.
- You can reply in English, Farsi, or Pashto based on the user's input language.
- If technical support is needed, suggest they log in to the dashboard to open a ticket.
`;

export const sendMessageToGemini = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  if (!aiClient) {
    return "I am currently offline (API Key missing). Please contact human support.";
  }

  try {
    // Using gemini-3-flash-preview for basic text and reasoning tasks
    const model = "gemini-3-flash-preview";
    const chat = aiClient.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const response = await chat.sendMessage({ message });
    
    // Access the .text property directly (not a method call) as per GenerateContentResponse definition
    if (response.text) {
        return response.text;
    }
    
    return "I apologize, I couldn't generate a response at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server. Please try again later.";
  }
};