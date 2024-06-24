import { head, map } from "lodash";
import { QuizInfo, QuizesResponse, Topics } from "../types";

// Function to parse JSON string
export const parseResponseJson = (response: QuizesResponse): QuizInfo[] | [] => {
  try {
    const quizes = map(response, ([name, values]) => {
      const data = JSON.parse(values) as Topics[];
      return {
        name,
        difficulty: head(data)?.difficulty,
        data,
      };
    }) as QuizInfo[];
    return quizes;
  } catch (error) {
    console.error("Error parsing JSON string:", error);
    return [];
  }
};
