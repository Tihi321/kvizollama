export interface Topic {
  name: string;
  color: string;
}

export interface Player {
  player: number;
}

export interface Cell {
  topic: Topic;
  soldier: Player | null;
  flag: Player | null;
}

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
  difficulty: string;
  topic: string;
};
