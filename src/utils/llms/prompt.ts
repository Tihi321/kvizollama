import { capitalize } from "lodash";

export const formatLldRequest = (
  topics: string[],
  difficulty: string,
  numQuestions: number,
  maxPoints: number
): string => {
  return `Topics: [${topics.join(
    ", "
  )}]\n\Maximum Difficulty: [${difficulty}]\n\Number of Questions per Topic: [${numQuestions}]\n\Maximum Total Points: [${maxPoints}]`;
};

export const getFormattedSystemPrompt = (systemPrompt: string, language: string): string => {
  return `${systemPrompt}Give me a JSON response in ${capitalize(language)} language.`;
};
