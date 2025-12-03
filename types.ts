
export interface Section {
  id: string;
  title: string;
  category: 'core' | 'safety' | 'advanced' | 'tools' | 'interactive' | 'info' | 'public';
  icon: string;
  content?: string;
  subsections?: { title: string; body: string }[];
}

export type QuizCategory = 'All' | 'Radiology Basics' | 'Safety & ALARA' | 'Anatomy Spotters' | 'Physics' | 'Modalities' | 'Positioning';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: QuizCategory;
  difficulty: Difficulty;
}

export interface CalculationResult {
  value: number;
  unit: string;
  formulaUsed: string;
}

export enum CalculatorType {
  INVERSE_SQUARE = 'INVERSE_SQUARE',
  MAS_RECIPROCITY = 'MAS_RECIPROCITY',
  SHIELDING = 'SHIELDING',
  EXPOSURE_TIME = 'EXPOSURE_TIME'
}

export type ViewState = 'START' | 'DASHBOARD' | 'SECTION';

export interface QuizResult {
  id: string;
  date: number;
  category: QuizCategory;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  xpEarned: number;
}

export interface UserProfile {
  name: string;
  level: number;
  currentXp: number;
  totalXp: number;
  nextLevelXp: number;
  quizzesTaken: number;
  history: QuizResult[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}