
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// --- EXPANDED OFFLINE KNOWLEDGE BASE ---
const offlineKnowledgeBase: Record<string, string> = {
  'kvp': 'kVp (Kilovoltage Peak) controls the penetrating power (quality) of the X-ray beam. Higher kVp reduces image contrast (more shades of gray) but lowers patient dose due to better penetration.',
  'mas': 'mAs (Milliampere-seconds) controls the total quantity of X-ray photons. It directly affects the density (blackness) of the image. Doubling mAs doubles the patient dose.',
  'alara': 'ALARA stands for "As Low As Reasonably Achievable". The three pillars are Time (minimize), Distance (maximize), and Shielding (utilize).',
  'mri': 'MRI (Magnetic Resonance Imaging) uses strong magnetic fields and radio waves. It does NOT use ionizing radiation. It is excellent for soft tissue visualization.',
  'ct': 'Computed Tomography (CT) uses a rotating X-ray tube to create cross-sectional images. It provides detailed bony and soft tissue structures but carries a higher radiation dose than plain X-rays.',
  'contrast': 'Contrast media (like Iodine or Barium) improves the visibility of internal structures. Always check renal function (Creatinine) before administering IV iodinated contrast.',
  'pregnancy': 'For pregnant patients, non-ionizing modalities like Ultrasound or MRI are preferred. If X-ray is necessary, strict collimation and shielding of the abdomen are mandatory.',
  'lead': 'Lead aprons typically have 0.25mm or 0.5mm lead equivalence. They attenuate over 90% of scatter radiation.',
  'dosimeter': 'A TLD or OSL dosimeter measures occupational radiation exposure. It should be worn at collar level, outside the lead apron.',
  'grid': 'Grids are placed between the patient and the film to absorb scatter radiation and improve image contrast. However, they require a higher dose (mAs) to maintain density.',
  'anode': 'The Anode is the positive electrode in the X-ray tube, usually made of Tungsten. The "Heel Effect" causes lower intensity on the anode side.',
  'cathode': 'The Cathode is the negative electrode containing the filament, which emits electrons via thermionic emission.',
  'bremsstrahlung': 'Bremsstrahlung (Braking) radiation occurs when an incoming electron slows down near the nucleus of a target atom, releasing energy as an X-ray photon.',
  'photoelectric': 'The Photoelectric Effect is the total absorption of an X-ray photon by an inner shell electron. It is responsible for image contrast but contributes significantly to patient dose.',
  'compton': 'Compton Scatter occurs when a photon hits an outer shell electron and changes direction. It degrades image quality (fog) and is the main source of occupational dose.',
  'stochastic': 'Stochastic effects (like cancer) have no threshold dose. The probability increases with dose, but severity does not.',
  'deterministic': 'Deterministic effects (like skin burns or cataracts) occur only above a specific threshold dose. Severity increases with dose.',
  'pixel': 'In digital imaging, a pixel is the smallest element of the image matrix. Smaller pixels mean better spatial resolution.',
  'dicom': 'DICOM (Digital Imaging and Communications in Medicine) is the standard format for storing and transmitting medical images.',
  'pacs': 'PACS (Picture Archiving and Communication System) is used to store and view digital images electronically.',
  'artifact': 'An artifact is any visual anomaly in an image that does not represent the anatomy (e.g., jewelry, motion blur, grid lines).',
  'ultrasound': 'Ultrasound uses high-frequency sound waves. It relies on the piezoelectric effect. Fluid is anechoic (black); bone/stones are hyperechoic (bright white).',
  'pet': 'PET (Positron Emission Tomography) uses radiotracers like F-18 FDG to visualize metabolic activity, often for cancer detection.',
  'half value layer': 'HVL is the thickness of absorber material required to reduce the X-ray beam intensity to half its original value.',
  'collimation': 'Collimation restricts the X-ray beam to the area of interest. This improves image quality by reducing scatter and significantly lowers patient dose.'
};

const getSimulatedDose = (modality: string, bodyPart: string): string => {
  const baseDose: Record<string, number> = {
    'X-Ray': 0.1, 'CT Scan': 8.0, 'Fluoroscopy': 5.0, 'Mammography': 0.4, 'Nuclear Medicine': 4.0
  };
  
  const factor = baseDose[modality] || 1;
  const rangeStart = (factor * 0.8).toFixed(2);
  const rangeEnd = (factor * 1.2).toFixed(2);
  
  const risks: Record<string, string> = {
    'X-Ray': 'Very Low (Comparable to a few days of background radiation).',
    'CT Scan': 'Moderate (Comparable to 2-3 years of background radiation).',
    'Fluoroscopy': 'Moderate (Dependent on time).',
    'Mammography': 'Low.',
    'Nuclear Medicine': 'Moderate to High depending on isotope.'
  };

  return `**Estimated Dose:** ${rangeStart} - ${rangeEnd} mSv
  
**Risk Level:** ${risks[modality] || 'Variable'}
  
**Smart Safety Tip:** 
${modality === 'CT Scan' ? 'Ensure justification. Use iterative reconstruction if available.' : 
  modality === 'X-Ray' ? 'Collimation is key. Only expose the area of interest.' : 
  'Follow ALARA principles strictly.'}
  
*(Simulated Response - No Internet/API Key)*`;
};

const getSimulatedChatResponse = (msg: string, context: string): string => {
  const lowerMsg = msg.toLowerCase();
  
  // 1. Check Offline Knowledge Base for Keywords
  for (const [key, answer] of Object.entries(offlineKnowledgeBase)) {
    if (lowerMsg.includes(key)) {
      return `**${key.toUpperCase()}:** ${answer}\n\n*(Offline Knowledge Base)*`;
    }
  }

  // 2. Generic Fallbacks
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return "Hello! I am 'RAD AI'. I'm currently in Offline Mode, but I can answer questions about Physics, Positioning, Anatomy, and Safety. Try asking 'What is kVp?' or 'Define ALARA'.";
  }
  
  return `I see you're asking about "${msg.substring(0, 15)}...". 
  
In **Offline Mode**, I can define key terms. Try using specific keywords like:
- "Photoelectric effect"
- "CT vs MRI"
- "Dose limits"
- "Pregnancy safety"
- "Inverse square law"

*Connect to the internet and add an API key for full generative conversations.*`;
};

// --- EXPORTED FUNCTIONS ---

export const generateDosePrediction = async (
  age: string, gender: string, modality: string, bodyPart: string, weight: string
): Promise<string> => {
  if (!ai) {
    return new Promise(resolve => setTimeout(() => resolve(getSimulatedDose(modality, bodyPart)), 1000));
  }
  try {
    const prompt = `Act as 'RAD AI'. Estimate effective radiation dose (mSv) for: Patient: ${gender}, ${age}yrs, ${weight}kg. Scan: ${modality} of ${bodyPart}. Output: 1. Dose Range, 2. Risk Level, 3. Safety Tip. Short.`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text || "No response generated.";
  } catch (error) {
    return getSimulatedDose(modality, bodyPart);
  }
};

export const askTutor = async (currentMessage: string, context: string, history: ChatMessage[]): Promise<string> => {
  if (!ai) {
    return new Promise(resolve => setTimeout(() => resolve(getSimulatedChatResponse(currentMessage, context)), 800));
  }
  try {
    const conversationHistory = history.map(h => `${h.role === 'user' ? 'Student' : 'Tutor'}: ${h.text}`).join('\n');
    const prompt = `You are 'RAD AI', an expert Radiology Tutor. CONTEXT: ${context}. HISTORY: ${conversationHistory}. QUESTION: ${currentMessage}. Answer concisely (under 100 words).`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text || "No response generated.";
  } catch (error) {
    return getSimulatedChatResponse(currentMessage, context);
  }
};

export const generateRadiologyImage = async (prompt: string, size: '1K' | '2K'): Promise<string> => {
  if (!ai) {
    // Offline / Fallback
    return new Promise(resolve => setTimeout(() => resolve("https://picsum.photos/seed/radiology/1024/1024"), 2000));
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `Radiology illustration: ${prompt}` }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: '1:1'
        }
      }
    });

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image generation failed", error);
    return "https://picsum.photos/seed/error/1024/1024";
  }
};
