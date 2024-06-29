export const formatLldRequest = (
  topics: string[],
  difficulty: string,
  numQuestions: number,
  maxPoints: number
): string => {
  return `Topics: [${topics.join(", ")}]\n\
  Maximum Difficulty: [${difficulty}]\n\
  Number of Questions per Topic: [${numQuestions}]\n\
  Maximum Total Points: [${maxPoints}]`;
};
