import { flatMap, get, map } from "lodash";
import { Question } from "./types";
import { Topics } from "../../types";

export const getAllQuestions = async (topic: Topics[]) => {
  const data = flatMap(
    map(topic, (values) => {
      const difficulty = get(values, "difficulty");
      const topic = get(values, "topic");
      const questions = get(values, "questions");

      return map(questions, (question: any) => ({
        ...question,
        difficulty,
        topic,
      }));
    })
  );

  return data as Question[];
};
