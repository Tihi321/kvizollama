import { filter, head } from "lodash";
import { QuizInfo, Topics } from "../types";

export const getStringValue = (name: string): string => {
  const data = localStorage.getItem(name);
  return data || "";
};

export const saveStringValue = (name: string, value: string): string => {
  localStorage.setItem(name, value);
  return value || "";
};

export const getLocalQuizes = (): QuizInfo[] => {
  const data = localStorage.getItem("quizes");
  return data ? JSON.parse(data) : [];
};

export const saveLocalQuiz = (name: string, values: string) => {
  const data: Topics[] = JSON.parse(values) || {};
  const localQuizes = getLocalQuizes();
  const newQuiz: QuizInfo = { name, data, difficulty: head(data)?.difficulty as string };

  const output: QuizInfo[] = [...localQuizes, newQuiz];

  localStorage.setItem("quizes", JSON.stringify(output));

  return output;
};

export const removeLocalQuiz = (name: string) => {
  const data = filter(getLocalQuizes(), (quiz) => quiz.name !== name);
  localStorage.setItem("quizes", JSON.stringify(data));

  return data;
};
