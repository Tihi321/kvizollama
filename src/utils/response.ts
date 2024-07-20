import { head, map } from "lodash";
import { QuizInfo, QuizesResponse, Topics } from "../types";
import { saveStringValue } from "../hooks/local";

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

// Function to parse JSON string that has artifacts
export const parseJsonFromString = (response: string): QuizInfo[] | [] => {
  const startIndex = response.indexOf("[");
  const endIndex = response.lastIndexOf("]") + 1; // +1 to include the bracket in the substring
  const jsonString = response.substring(startIndex, endIndex);
  saveStringValue(`kvizolamma/lastgeneration`, jsonString);
  try {
    const jsonData = JSON.parse(jsonString);
    return jsonData;
  } catch (error) {
    throw error;
  }
};
