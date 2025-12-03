
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateDosePrediction = async (
  age: string,
  gender: string,
  modality: string,
  bodyPart: string,
  weight: string
): Promise<string> => {
  if (!ai) return "API Key is missing.";

  try {
    const prompt = `
      Act as 'RAD AI', a friendly and expert Radiology Safety Assistant.
      Estimate the effective radiation dose (mSv) for:
      Patient: ${gender}, ${age} years, ${weight}kg
      Scan: ${modality} of ${bodyPart}
      
      Output Structure:
      1. **Estimated Dose:** (Range in mSv)
      2. **Risk Level:** (Low/Med/High) with a simple comparison (e.g., "Equivalent to X days of sun").
      3. **Smart Safety Tip:** One key ALARA tip for this specific exam.
      
      Keep it short, professional, yet easy to understand.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating prediction.";
  }
};

export const askTutor = async (
  currentMessage: string, 
  context: string,
  history: ChatMessage[]
): Promise<string> => {
  if (!ai) return "API Key is missing.";

  try {
    // Format history for context
    const conversationHistory = history.map(h => 
      `${h.role === 'user' ? 'Student' : 'Tutor'}: ${h.text}`
    ).join('\n');

    const prompt = `
      You are 'RAD AI', an expert Radiology Tutor for Allied Health students.
      
      CURRENT LESSON CONTEXT:
      ${context}

      CONVERSATION HISTORY:
      ${conversationHistory}

      STUDENT QUESTION:
      ${currentMessage}
      
      INSTRUCTIONS:
      - Answer based on the Current Lesson Context provided.
      - Be encouraging, professional, but simple (Zero to Hero style).
      - If the user asks something outside the context, answer it but relate it back to radiology.
      - Keep answers concise (under 200 words) unless asked for a detailed explanation.
      - Use markdown for bolding key terms.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error contacting RAD AI.";
  }
};
