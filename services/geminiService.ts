
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, QuizQuestion } from "../types";

/**
 * RAD SAFE PRO - Unified AI Service Layer
 * Centralizes all interactions with Google GenAI using Gemini 3 & 2.5.
 */

// Factory to ensure we always use a new instance with the latest injected API Key
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Universal Chat / Tutor Logic
 * Model: gemini-3-flash-preview
 */
export const askTutor = async (currentMessage: string, context: string, history: ChatMessage[]): Promise<string> => {
  try {
    const ai = getAIClient();
    const historyParts = history.slice(-10).map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...historyParts,
        { role: 'user', parts: [{ text: `System Context: ${context}\n\nUser Message: ${currentMessage}` }] }
      ],
      config: {
        systemInstruction: "You are Dr. Rad, a helpful AI assistant for RAD SAFE PRO. You assist radiology students and patients. Be precise, empathetic, and prioritize safety (ALARA). Keep responses under 100 words."
      }
    });
    return response.text || "I'm processing your request. Please try again in a moment.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I encountered a connection glitch. Please try asking again.";
  }
};

/**
 * Clinical Dose Prediction
 * Model: gemini-3-flash-preview
 */
export const generateDosePrediction = async (
  age: string, gender: string, modality: string, bodyPart: string, weight: string
): Promise<string> => {
  try {
    const ai = getAIClient();
    const prompt = `Clinical parameters: Patient Age ${age}, Gender ${gender}, Weight ${weight}kg. Procedure: ${modality} of ${bodyPart}. 
    Provide: Estimated Effective Dose Range (mSv), Biological Risk Level, and a Safety Tip.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a Medical Physics assistant. Provide estimated diagnostic dose data for educational simulations."
      }
    });
    return response.text || "Unable to calculate dose. Consult standard dosimetry charts.";
  } catch (error) {
    return "Dose prediction unavailable. Ensure ALARA protocols are followed.";
  }
};

/**
 * Quiz Generation
 * Model: gemini-3-flash-preview
 */
export const generateAIQuiz = async (topic: string, count: number): Promise<QuizQuestion[]> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a high-quality MCQ quiz about: '${topic}'. Return ${count} questions.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.NUMBER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};

/**
 * Geographic Radiation & Place Profile (Maps Grounding)
 * Model: gemini-2.5-flash
 */
export const getGeographicRadiationProfile = async (lat: number, lng: number) => {
  try {
    const ai = getAIClient();
    const prompt = `SEARCH COMMAND: Analyze the location Lat: ${lat}, Lng: ${lng} using Google Maps.
    
    1. Identify all nearby "Radiation Hubs": Hospitals, Radiology Centers, Nuclear Medicine facilities.
    2. Analyze common environmental radiation sources in this specific area:
       - Explain Non-Ionizing sources: Wi-Fi routers, Mobile towers, and handheld devices in nearby shops/homes.
       - Explain Ionizing sources: Clinical equipment and natural background radiation from soil/buildings.
    3. List at least 3 facility names found nearby.

    Structure your answer exactly like this:
    ### LOCALITY IDENTIFIED: [Exact Place Name]
    
    ### CLINICAL RADIATION HUBS:
    - [Facility 1]
    - [Facility 2]
    - [Facility 3]
    
    ### ENVIRONMENTAL SOURCE ANALYSIS:
    **Clinical Exposure:** [Details about nearby hospital x-ray/scan zones]
    **Commercial/Daily Life:** [Analysis of Wi-Fi, Mobile Towers, and Shops in this area. Clarify the difference between non-ionizing (safe) and ionizing radiation.]
    **Natural Background:** [Typical soil/terrestrial radiation for this region]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      },
    });

    return {
      text: response.text || "Mapping data processed. Nearby clinical facilities identified.",
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Mapping Engine Error:", error);
    throw error;
  }
};

/**
 * Image Generation (Nano Banana)
 * Model: gemini-2.5-flash-image or gemini-3-pro-image-preview
 * Logic: Iterate through parts to find inlineData.
 */
export const generateRadiologyImage = async (prompt: string, size: '1K' | '2K' = '1K'): Promise<string> => {
  try {
    const ai = getAIClient();
    // Upgrade to gemini-3-pro-image-preview for high-quality (2K) requests as per guidelines
    const model = size === '2K' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          // Only gemini-3-pro-image-preview supports imageSize configuration.
          ...(model === 'gemini-3-pro-image-preview' ? { imageSize: size } : {})
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          return `data:image/png;base64,${base64Data}`;
        }
      }
    }
    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Radiology Image Generation Error:", error);
    throw error;
  }
};
