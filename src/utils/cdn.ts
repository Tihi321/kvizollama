import { head, map, flatMap, replace } from "lodash";
import { CdnQuizInfo, QuizInfo, Topics } from "../types";

const CDN_ENDPOINT = "https://cdn.tihomir-selak.from.hr/assets/api/ollama";
const QUIZ_ROUTE = "quiz";

const AVAILABLE_QUIZES_PATH = "quizes.json";

export const fetchCdnAvailableQuizes = async () => {
  const response = await fetch(`${CDN_ENDPOINT}/${AVAILABLE_QUIZES_PATH}`);
  const jsonResponse = await response.json();
  const availableQuizes: string[] = flatMap(jsonResponse);
  const output = map(availableQuizes, (path: string) => {
    return {
      name: replace(path, "/", "-"),
      path,
    };
  });
  return output as CdnQuizInfo[];
};

export const getCdnQuiz = async (path: string, name: string) => {
  const response = await fetch(`${CDN_ENDPOINT}/${QUIZ_ROUTE}/${path}.json`);
  const data = (await response.json()) as Topics[];

  return {
    name: name,
    difficulty: head(data)?.difficulty,
    data: data,
  } as QuizInfo;
};

export const getCustomQuiz = async (url: string, name: string) => {
  const response = await fetch(url);
  const data = (await response.json()) as Topics[];

  return {
    name: name,
    difficulty: head(data)?.difficulty,
    data: data,
  } as QuizInfo;
};
