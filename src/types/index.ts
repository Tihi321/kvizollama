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
