import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;

export const initializeChat = () => {
  try {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.warn("API Key not found in process.env.API_KEY. Please ensure it is set.");
      return null;
    }
    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-3-flash-preview as requested for basic text tasks
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return null;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    return "I'm currently offline. Please contact support.";
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "I didn't understand that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while processing your request.";
  }
};