
export enum QuizCategory {
  FOOD = 'FOOD',
  DRINKS = 'DRINKS',
  WINE = 'WINE'
}

export type Language = 'ES' | 'EN';

export interface QuizMessage {
  role: 'professor' | 'user';
  content: string;
  isCorrect?: boolean;
  imageUrl?: string;
}

export interface QuizState {
  currentCategory: QuizCategory | null;
  history: QuizMessage[];
  isLoading: boolean;
  score: number;
  totalAsked: number;
}
