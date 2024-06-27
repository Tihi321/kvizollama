import { filter, head } from "lodash";
import { CustomQuizInfo, QuizInfo, Topics } from "../types";

export const getBooleanValue = (name: string): boolean => {
  const data: string = localStorage.getItem(name) || "";
  return data === "true" ? true : false;
};

export const saveBooleanValue = (name: string, value: boolean) => {
  console.log(value);
  localStorage.setItem(name, value ? "true" : "false");
};

export const getStringValue = (name: string): string => {
  const data = localStorage.getItem(name);
  return data || "";
};

export const saveStringValue = (name: string, value: string) => {
  localStorage.setItem(name, value);
};

export const getCustomQuizes = (): CustomQuizInfo[] => {
  const data = localStorage.getItem("customquizes");
  return JSON.parse(data || "[]") || [];
};

export const saveCustomQuiz = (name: string, url: string) => {
  const localValues = getCustomQuizes();
  const output: CustomQuizInfo[] = [...localValues, { name, url }];
  localStorage.setItem("customquizes", JSON.stringify(output));
};

export const removeCustomQuiz = (name: string) => {
  const data = filter(getCustomQuizes(), (values) => values.name !== name);
  localStorage.setItem("customquizes", JSON.stringify(data));
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
};

export const removeLocalQuiz = (name: string): QuizInfo[] => {
  const data = filter(getLocalQuizes(), (quiz) => quiz.name !== name);
  localStorage.setItem("quizes", JSON.stringify(data));

  return data;
};
