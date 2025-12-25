
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
      contents: `Eres el Profesor Chipoco, el Senior Manager más exigente de la Academia CVI.CHE 105. 
      ID de Sesión Académica: ${entropy}
      Contenido del Manual: ${dataContext}
      
      TAREA: Formula UNA pregunta técnica, específica y desafiante sobre el manual. 
      ESTILO: Profesional, autoritario, académico. No aceptes respuestas mediocres.
      IDIOMA: Responde exclusivamente en ${lang === 'ES' ? 'Español' : 'Inglés'}.
      
      IMPORTANTE: Enfócate en detalles técnicos como ingredientes específicos o métodos de preparación de la sección "${randomSectionHint}". 
      Inicia con un saludo formal si es la primera pregunta.`,
      config: { 
        temperature: 0.8,
        topP: 0.95
      },
    });

    return response.text || "Error al generar la pregunta.";
  } catch (error) {
    console.error("Error en Gemini API (Generar Pregunta):", error);
    throw error;
  }
};

export const evaluateAnswer = async (category: QuizCategory, question: string, userAnswer: string, lang: Language = 'ES') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const dataContext = MANUAL_DATA[category];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Pregunta del Profesor: "${question}"
      Respuesta del Estudiante: "${userAnswer}"
      Referencia del Manual: ${dataContext}
      
      TAREA: Evalúa con rigor académico. Un error en un ingrediente es una respuesta incorrecta.
      IDIOMA: El feedback debe estar en ${lang === 'ES' ? 'Español' : 'Inglés'}.
      
      ESTRUCTURA JSON:
      - isCorrect: true solo si la respuesta es precisa según el manual.
      - feedback: Crítica del profesor (felicita la excelencia o señala la falta de estudio).
      - productName: Nombre exacto del plato o bebida discutida.
      - correctAnswer: La información exacta que el manual dicta.`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
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

    return JSON.parse(response.text || '{"isCorrect": false, "feedback": "Error de procesamiento", "productName": "", "correctAnswer": ""}');
  } catch (error) {
    console.error("Error en Gemini API (Evaluar Respuesta):", error);
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
            text: `Professional food photography of "${productName}" for CVI.CHE 105 restaurant. 
            Gourmet Peruvian plating, high-end restaurant lighting, white plate, minimalist background, 4k.`,
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
    console.error("Error al generar imagen:", error);
  }

  return null;
};
