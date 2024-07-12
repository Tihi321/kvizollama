import { filter, head } from "lodash";
import { CustomQuizInfo, QuizInfo, SelectedQuizes, Topics } from "../types";

export const getBooleanValue = (name: string): boolean => {
  const data: string = localStorage.getItem(name) || "";
  return data === "true" ? true : false;
};

export const saveBooleanValue = (name: string, value: boolean) => {
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
  const data = localStorage.getItem("kvizolamma/customquizes");
  return JSON.parse(data || "[]") || [];
};

export const saveCustomQuiz = (name: string, url: string) => {
  const localValues = getCustomQuizes();
  const output: CustomQuizInfo[] = [...localValues, { name, url }];
  localStorage.setItem("kvizolamma/customquizes", JSON.stringify(output));
};

export const removeCustomQuiz = (name: string) => {
  const data = filter(getCustomQuizes(), (values) => values.name !== name);
  localStorage.setItem("kvizolamma/customquizes", JSON.stringify(data));
};

export const getLocalQuizes = (): QuizInfo[] => {
  const data = localStorage.getItem("kvizolamma/quizes");
  return data ? JSON.parse(data) : [];
};

export const saveLocalQuiz = (name: string, values: string) => {
  const data: Topics[] = JSON.parse(values) || {};
  const localQuizes = getLocalQuizes();
  const newQuiz: QuizInfo = { name, data, difficulty: head(data)?.difficulty as string };

  const output: QuizInfo[] = [...localQuizes, newQuiz];

  localStorage.setItem("kvizolamma/quizes", JSON.stringify(output));
};

export const removeLocalQuiz = (name: string): QuizInfo[] => {
  const data = filter(getLocalQuizes(), (quiz) => quiz.name !== name);
  localStorage.setItem("kvizolamma/quizes", JSON.stringify(data));

  return data;
};

export const getSelectedQuizes = (): SelectedQuizes => {
  const data = localStorage.getItem("kvizolamma/selectedquizes");
  return data
    ? JSON.parse(data)
    : {
        cdn: [],
        custom: [],
        local: [],
        file: [],
      };
};

export const saveSelectedQuiz = (name: string, type: string): SelectedQuizes => {
  const localData = getSelectedQuizes();

  let output = { ...localData };

  switch (type) {
    case "cdn":
      output = {
        ...localData,
        cdn: [...localData.cdn, name],
      };
      break;
    case "custom":
      output = {
        ...localData,
        custom: [...localData.custom, name],
      };
      break;
    case "local":
      output = {
        ...localData,
        local: [...localData.local, name],
      };
      break;
    case "file":
      output = {
        ...localData,
        file: [...localData.file, name],
      };
      break;
  }

  localStorage.setItem("kvizolamma/selectedquizes", JSON.stringify(output));

  return output as SelectedQuizes;
};

export const removeSelectedQuiz = (name: string, type: string): SelectedQuizes => {
  const localData = getSelectedQuizes();
  let output = {};

  switch (type) {
    case "cdn":
      output = {
        ...localData,
        cdn: filter(localData.cdn, (values) => values !== name),
      };
      break;
    case "custom":
      output = {
        ...localData,
        custom: filter(localData.custom, (values) => values !== name),
      };
      break;
    case "local":
      output = {
        ...localData,
        local: filter(localData.local, (values) => values !== name),
      };
      break;
    case "file":
      output = {
        ...localData,
        file: filter(localData.file, (values) => values !== name),
      };
      break;
  }

  localStorage.setItem("kvizolamma/selectedquizes", JSON.stringify(output));

  return output as SelectedQuizes;
};
