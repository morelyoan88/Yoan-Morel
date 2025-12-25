
import { GoogleGenAI, Type } from "@google/genai";
import { MANUAL_DATA, MANUAL_IMAGES } from "../constants";
import { QuizCategory, Language } from "../types";

export const generateQuestion = async (category: QuizCategory, lang: Language = 'ES') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const dataContext = MANUAL_DATA[category];
  
  const entropy = Math.random().toString(36).substring(7);
  const sections = dataContext.split('- ').filter(s => s.trim().length > 0);
  const randomSectionHint = sections[Math.floor(Math.random() * sections.length)].split(':')[0];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Professor Chipoco, the most demanding Senior Manager at CVI.CHE 105 Academy. 
      Session ID: ${entropy}
      Context Data (The Manual): ${dataContext}
      
      TASK: Ask ONE specific, technical, and challenging question based on the manual. 
      STYLE: Professional, authoritative, academic. You are testing a student who must reach excellence.
      LANGUAGE: Respond exclusively in ${lang === 'ES' ? 'Spanish' : 'English'}.
      
      CRITICAL: Don't be predictable. Probe deep into the "${randomSectionHint}" or other complex details. 
      Start with a brief academic greeting if it's the first question, emphasizing that "Excellence is in the details".`,
      config: { 
        temperature: 0.8,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    return response.text || "Error generating question.";
  } catch (error) {
    console.error("Gemini API Error (Generate Question):", error);
    throw error;
  }
};

export const evaluateAnswer = async (category: QuizCategory, question: string, userAnswer: string, lang: Language = 'ES') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const dataContext = MANUAL_DATA[category];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Professor's Question: "${question}"
      Student's Answer: "${userAnswer}"
      Manual Reference: ${dataContext}
      
      TASK: Evaluate the answer with academic rigor. 
      LANGUAGE: Feedback must be in ${lang === 'ES' ? 'Spanish' : 'English'}.
      
      JSON SCHEMA REQUIREMENT:
      - isCorrect: true only if they got the core ingredients/details right.
      - feedback: A professor-style critique (encouraging if correct, strict if wrong).
      - productName: The specific item discussed (e.g., "Lomo Saltado").
      - correctAnswer: The exact information from the manual if they missed it.`,
      config: {
        thinkingConfig: { thinkingBudget: 5000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            productName: { type: Type.STRING },
            correctAnswer: { type: Type.STRING }
          },
          required: ["isCorrect", "feedback", "productName", "correctAnswer"]
        }
      }
    });

    return JSON.parse(response.text || '{"isCorrect": false, "feedback": "Error parsing response", "productName": "", "correctAnswer": ""}');
  } catch (error) {
    console.error("Gemini API Error (Evaluate Answer):", error);
    throw error;
  }
};

export const getProductImage = async (productName: string): Promise<{ url: string; isReal: boolean } | null> => {
  if (!productName) return null;

  const exactMatch = Object.keys(MANUAL_IMAGES).find(key => 
    productName.toLowerCase().includes(key.toLowerCase()) || 
    key.toLowerCase().includes(productName.toLowerCase())
  );

  if (exactMatch) {
    return { url: MANUAL_IMAGES[exactMatch], isReal: true };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `High-end professional food photography of "${productName}" from the CVI.CHE 105 menu. 
            Peruvian gourmet presentation, bright studio lighting, white ceramic plate, restaurant setting, 4k.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return { url: `data:image/png;base64,${part.inlineData.data}`, isReal: false };
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }

  return null;
};
