import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;

export const initializeChat = () => {
  try {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY
    const apiKey = process.env.API_KEY;
    
    // Debug log to check if key exists (first 4 chars only for safety)
    if (apiKey) {
      console.log(`Chat initialized. Key present: ${apiKey.substring(0, 4)}...`);
    } else {
      console.error("Chat init failed: API_KEY is missing in process.env");
    }
    
    // Check for empty string or undefined
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
      console.warn("API Key is missing or invalid. Set API_KEY in Vercel Environment Variables.");
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
    return "SYSTEM: I'm currently offline. (API Key Missing. Please add API_KEY to Vercel and REDEPLOY).";
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "I didn't understand that.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    const errMsg = error.message || error.toString();

    if (errMsg.includes("401") || errMsg.includes("key")) {
        return "SYSTEM ERROR: API Key is invalid. Check Vercel Settings.";
    }
    if (errMsg.includes("404") || errMsg.includes("not found")) {
        return "SYSTEM ERROR: AI Model unavailable in this region (Try VPN).";
    }
    if (errMsg.includes("429")) {
        return "SYSTEM ERROR: Traffic limit reached. Try again later.";
    }

    return "An error occurred while connecting to AI. Please try refreshing.";
  }
};