export type Answer = {
  answer: string;
  correct: boolean;
  points: number;
};

export type Question = {
  question: string;
  answers: Answer[];
  hint: string;
  explanation: string;
};

export type Topic = {
  topic: string;
  difficulty: string;
  questions: Question[];
};

export type QuizQuestionResponse = {
  topic: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  points: number;
  correct: boolean;
};

export interface QuizFormData {
  topics: string[];
  difficulty: string;
  num_questions: number;
  max_points: number;
}
