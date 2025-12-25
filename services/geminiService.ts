
import { GoogleGenAI, Type } from "@google/genai";
import { MANUAL_DATA } from "../constants";
import { QuizCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuestion = async (category: QuizCategory) => {
  const dataContext = MANUAL_DATA[category];
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a Senior Manager at CVI.CHE 105. Your job is to train new staff. 
    Based on this data: ${dataContext}, 
    Ask ONE specific question about a menu item, its ingredients, the preparation method, or common allergies.
    Be encouraging but professional. Make the question feel like a real spot-check in the restaurant.`,
    config: {
      temperature: 0.9,
    },
  });

  return response.text || "I'm sorry, I couldn't think of a question. Let's try again.";
};

export const evaluateAnswer = async (category: QuizCategory, question: string, userAnswer: string) => {
  const dataContext = MANUAL_DATA[category];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Question: "${question}"
    User Answer: "${userAnswer}"
    Context Data: ${dataContext}
    
    Evaluate if the answer is correct according to the manual. 
    Provide a JSON response with "isCorrect" (boolean) and "feedback" (string explaining why and providing the full correct info if they missed something).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCorrect: { type: Type.BOOLEAN },
          feedback: { type: Type.STRING }
        },
        required: ["isCorrect", "feedback"]
      }
    }
  });

  return JSON.parse(response.text || '{"isCorrect": false, "feedback": "System error evaluating answer."}');
};
