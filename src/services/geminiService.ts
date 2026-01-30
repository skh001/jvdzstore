import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    // 👇 C'est ici que ça changeait. On cherche VITE_API_KEY maintenant.
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey) {
      console.error("ERREUR : Clé VITE_API_KEY introuvable. Vérifie ton fichier .env");
      return "Erreur système : Clé API manquante (VITE_API_KEY).";
    }

    // Initialisation
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Modèle rapide et stable
      systemInstruction: SYSTEM_INSTRUCTION 
    });

    // Envoi
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("Erreur Gemini:", error);
    return "Désolé, je n'arrive pas à me connecter à l'IA.";
  }
};