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

export type Topics = {
  topic: string;
  difficulty: string;
  questions: Question[];
};

export type QuizInfo = {
  name: string;
  difficulty: string;
  data: Topics[];
};

export type QuizesResponse = Array<[string, string]>;

export type QuizQuestionResponse = {
  topic: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  points: number;
  correct: boolean;
};

export interface QuizFormData {
  name: string;
  topics: string[];
  difficulty: string;
  num_questions: number;
  max_points: number;
}
