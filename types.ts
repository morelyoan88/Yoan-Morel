
export enum QuizCategory {
  FOOD = 'FOOD',
  DRINKS = 'DRINKS',
  WINE = 'WINE'
}

export interface QuizMessage {
  role: 'professor' | 'user';
  content: string;
  isCorrect?: boolean;
}

export interface QuizState {
  currentCategory: QuizCategory | null;
  history: QuizMessage[];
  isLoading: boolean;
  score: number;
  totalAsked: number;
}
