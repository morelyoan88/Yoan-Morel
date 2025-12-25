
import { GoogleGenAI, Type } from "@google/genai";
import { MANUAL_DATA, MANUAL_IMAGES } from "../constants";
import { QuizCategory, Language } from "../types";

export const generateQuestion = async (category: QuizCategory, lang: Language = 'ES') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const dataContext = MANUAL_DATA[category];
  
  const entropy = Math.random().toString(36).substring(7);
  const sections = dataContext.split('- ').filter(s => s.trim().length > 0);
  const randomSectionHint = sections[Math.floor(Math.random() * sections.length)].split(':')[0];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a Senior Manager at CVI.CHE 105 restaurant. 
    Session ID: ${entropy}
    Context Data: ${dataContext}
    
    TASK: Ask ONE specific and challenging question.
    LANGUAGE: Respond exclusively in ${lang === 'ES' ? 'Spanish' : 'English'}.
    CRITICAL: Do NOT always ask about the first items. Try to pick something from the "${randomSectionHint}" section or other parts.
    Make the question professional, direct, and authoritative as a restaurant manager would.`,
    config: { 
      temperature: 1.0,
      topP: 0.95,
      topK: 64
    },
  });

  return response.text || "Error.";
};

export const evaluateAnswer = async (category: QuizCategory, question: string, userAnswer: string, lang: Language = 'ES') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const dataContext = MANUAL_DATA[category];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Question: "${question}", User's Answer: "${userAnswer}", Manual Context: ${dataContext}. 
    LANGUAGE: Provide feedback exclusively in ${lang === 'ES' ? 'Spanish' : 'English'}.
    Evaluate accuracy. If wrong, explain why using the manual as reference and provide the "correctAnswer" based on the data context.`,
    config: {
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

  return JSON.parse(response.text || '{"isCorrect": false, "feedback": "Error", "productName": "", "correctAnswer": ""}');
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
            text: `High-end professional food photography of "${productName}" as served at CVI.CHE 105 restaurant. 
            Gourmet presentation, vibrant Peruvian ingredients, restaurant table setting, 4k quality.`,
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
