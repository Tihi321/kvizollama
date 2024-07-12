import { find, forEach, head, isEqual, split } from "lodash";
import { QuizInfo, SelectedQuizes, Topics } from "../types";
import { getCdnQuiz, getCustomQuiz } from "./cdn";

export const getNameValueString = (name: string, value: string) => {
  return `${name};*;${value}`;
};

const getNameValueFromString = (value: string) => {
  const values = split(value, ";*;");
  return {
    name: values[0],
    value: values[1],
  };
};

const getTopDifficulty = (quizes: QuizInfo[]) => {
  let difficulty = "Easy";
  forEach(quizes, (quiz) => {
    if (difficulty !== "Hard") {
      if (quiz.difficulty === "Hard") {
        difficulty = "Hard";
      } else if (quiz.difficulty === "Medium") {
        difficulty = "Medium";
      }
    }
  });

  return difficulty;
};

const combinedQuestions = (quizes: QuizInfo[]): Topics[] => {
  let questions: Topics[] = [];
  forEach(quizes, (quiz) => {
    forEach(quiz.data, (topic) => {
      questions.push(topic);
    });
  });
  return questions;
};

export const getSelectedCombinedQuiz = async (
  selectedQuizes: SelectedQuizes,
  fileQuizes: QuizInfo[],
  localQuizes: QuizInfo[]
) => {
  let cdnQuizPromises: Promise<QuizInfo>[] = [];
  let customQuizPromises: Promise<QuizInfo>[] = [];
  let fileQuizesData: (QuizInfo | undefined)[] = [];
  let localQuizesData: (QuizInfo | undefined)[] = [];

  forEach(selectedQuizes, (value, key) => {
    if (key === "local") {
      localQuizesData = value.map((value) => {
        return find(localQuizes, ({ name }) => isEqual(name, value));
      });
    } else if (key === "cdn") {
      cdnQuizPromises = value.map((values) => {
        const { name, value } = getNameValueFromString(values);
        return getCdnQuiz(value, name);
      });
    } else if (key === "custom") {
      customQuizPromises = value.map((values) => {
        const { name, value } = getNameValueFromString(values);
        return getCustomQuiz(value, name);
      });
    } else if (key === "file") {
      fileQuizesData = value.map((value) => {
        return find(fileQuizes, ({ name }) => isEqual(name, value));
      });
    }
  });

  const quizesResponse = await Promise.all([...cdnQuizPromises, ...customQuizPromises]);

  const combinedQuizes = [...quizesResponse, ...fileQuizesData, ...localQuizesData] as QuizInfo[];
  if (combinedQuizes.length > 1) {
    const topDifficulty = getTopDifficulty(combinedQuizes);
    const questions = combinedQuestions(combinedQuizes);

    return {
      name: "Combined Quiz",
      difficulty: topDifficulty,
      data: questions,
    };
  } else {
    return head(combinedQuizes) as QuizInfo;
  }
};
