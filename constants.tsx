
import { QuizCategory, Language } from './types';

export const MANUAL_DATA = {
  FOOD: `
    - Glossary: Ají Limo (hot red chili), Ají Panca (dried dark red), Canary Beans (yellow), Cancha (roasted corn), Causa (mashed potato appetizer), Choclo (large white corn), Leche de Tigre (citrus base).
    - Sauces: Acevichada (LDT, mayo), Huancaina (yellow pepper, crackers, milk, cheese), Anticuchera (aji panca, vinegar, garlic).
    - Causas: Limeña (chicken salad), Cangrejo (crab salad), Traviesa (crab, fish ceviche), Mi Querida Chincha (squid ink, tuna).
    - Tiraditos: Pura Tradicion (white fish, LDT), Atun Tostado (tuna tataki), Hamachi Tiradito (soy ginger, truffle oil).
    - Ceviches: Anconero Clasico (white fish), Pimentel (fish, shrimp, octopus, smoky rocoto), Nikkei Tartar (tuna, soy ginger).
    - Sushi Rolls: Furai 105 (salmon, cream cheese, avocado), Acevichado 105 (crab, shrimp, tuna).
    - Tradicionales: Aji de Gallina (shredded chicken stew), Lomo Saltado (beef stir fry), Seco Chiclayano (short rib in cilantro sauce).
    - Arroces: Arroz con Mariscos (seafood mix), Chaufon (seafood fried rice).
  `,
  DRINKS: `
    - Cocktails: Pisco Sour (Blended: Pisco 105, Lime, Egg White, Syrup, Bitters), Chilcano (Built: Pisco 105, Lime, Ginger Ale, Bitters).
    - Sobe By Juan Chipoco: Hendricks Gin, Mandarin Cordial, Yuzu Foam, Lime.
    - Mule Andino: Bourbon, Chicha Morada Syrup, Ginger Beer.
    - New Cocktails: Gold Fashioned (Dewars 12, Gold), Pisco Kion (Ginger Mint Foam), Llama Rosa (Paloma with Mezcal).
  `,
  WINE: `
    - Whites: Rombauer, Twenty Acres, Lagar de Bauza.
    - Reds: Darioush, Silver Oak, CVI.CHE105 Merlot, Trivento.
  `
};

export const MANUAL_IMAGES: Record<string, string> = {
  "Lomo Saltado": "https://www.ceviche105.com/wp-content/uploads/2023/04/Lomo-Saltado.jpg",
  "Pisco Sour": "https://www.ceviche105.com/wp-content/uploads/2023/04/Pisco-Sour.jpg",
  "Causa Limeña": "https://www.ceviche105.com/wp-content/uploads/2023/04/Causa-Limena.jpg",
  "Ceviche Anconero": "https://www.ceviche105.com/wp-content/uploads/2023/04/Anconero.jpg",
  "Aji de Gallina": "https://www.ceviche105.com/wp-content/uploads/2023/04/Aji-de-Gallina.jpg",
  "Tiradito Pura Tradicion": "https://www.ceviche105.com/wp-content/uploads/2023/04/Pura-Tradicion.jpg"
};

export const TRANSLATIONS: Record<Language, any> = {
  ES: {
    heroTitle: "CVI.CHE 105",
    heroSubtitle: "Academy",
    heroDesc: "Capacitación de alto nivel con fotos reales del manual y evaluación asistida por IA.",
    startBtn: "Empezar Entrenamiento →",
    shareBtn: "Compartir con el Equipo",
    excellence: "Excelencia en cada detalle",
    manager: "Manager",
    placeholder: "Escribe tu respuesta...",
    send: "Enviar",
    loadingImg: "EL MANAGER ESTÁ BUSCANDO LA FOTO...",
    loadingQuestion: "Preparando siguiente pregunta...",
    manualRef: "Referencia del Manual CVI.CHE 105",
    tryAgain: "Intentar de nuevo",
    showAnswer: "Ver respuesta correcta",
    correctAnswerLabel: "Respuesta correcta:",
    categories: {
      [QuizCategory.FOOD]: { name: "Manual de Comida", desc: "Causas, Ceviches, Sushi y Arroces." },
      [QuizCategory.DRINKS]: { name: "Manual de Bebidas", desc: "Pisco Sours y Coctelería de Autor." },
      [QuizCategory.WINE]: { name: "Lista de Vinos", desc: "Nuestra selección de cavas y vinos." }
    }
  },
  EN: {
    heroTitle: "CVI.CHE 105",
    heroSubtitle: "Academy",
    heroDesc: "High-level training with real manual photos and AI-powered evaluation.",
    startBtn: "Start Training →",
    shareBtn: "Share with Team",
    excellence: "Excellence in every detail",
    manager: "Manager",
    placeholder: "Type your answer...",
    send: "Send",
    loadingImg: "MANAGER IS LOOKING FOR THE PHOTO...",
    loadingQuestion: "Preparing next question...",
    manualRef: "CVI.CHE 105 Manual Reference",
    tryAgain: "Try again",
    showAnswer: "Show correct answer",
    correctAnswerLabel: "Correct answer:",
    categories: {
      [QuizCategory.FOOD]: { name: "Food Manual", desc: "Causas, Ceviches, Sushi and Rices." },
      [QuizCategory.DRINKS]: { name: "Drinks Manual", desc: "Pisco Sours and Signature Cocktails." },
      [QuizCategory.WINE]: { name: "Wine List", desc: "Our selection of cavas and wines." }
    }
  }
};
