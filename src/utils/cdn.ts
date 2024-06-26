import { get, head, map } from "lodash";
import { QuizInfo, Topics } from "../types";

const CDN_ENDPOINT = "https://cdn.tihomir-selak.from.hr/assets/api/ollama";
const QUIZ_ROUTE = "quiz";

const AVAILABLE_QUIZES_PATH = "quizes.json";

export const fetchCdnAvailableQuizes = async () => {
  const response = await fetch(`${CDN_ENDPOINT}/${AVAILABLE_QUIZES_PATH}`);
  return response.json();
};

export const getCdnQuizes = async () => {
  const arailableQuizes = await fetchCdnAvailableQuizes();
  const perplexity: string[] = get(arailableQuizes, ["perplexity"]);

  const quizRoutes = map(perplexity, (path) => ({
    name: path,
    url: `${CDN_ENDPOINT}/${QUIZ_ROUTE}/${path}.json`,
  }));

  // Fetch each quiz JSON and wait for all to be fetched
  const quizzesPromises = quizRoutes.map(async ({ name, url }) => {
    const response = await fetch(url);
    const data = (await response.json()) as Topics[];
    return {
      name: name.replace("/", "-"),
      difficulty: head(data)?.difficulty,
      data: data,
    };
  });

  const quizzes = await Promise.all(quizzesPromises);

  return quizzes as QuizInfo[];
};
