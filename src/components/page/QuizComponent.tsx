import { Component, createSignal, Show, createMemo, createEffect } from "solid-js";
import { Question, QuizQuestionResponse, Topics } from "../../types";
import { QuizQuestion } from "./QuizQuestion";
import { QuizSummary } from "./QuizSummary";
import { styled } from "solid-styled-components";
import { getStringValue } from "../../hooks/local";
import { shuffle, slice } from "lodash";

interface QuizComponentProps {
  quiz: Topics[];
  onSubmit: () => void;
  onCancel: () => void;
}

type QuizComponentQuestions = Array<{
  topic: string;
  difficulty: string;
  title: string;
  question: Question;
}>;

const QuizContainer = styled("div")`
  position: relative;
  padding: 20px;
  flex: 1;
  display: flex;
`;

const mergeTopicsAndQuestions = (quiz: Topics[]): QuizComponentQuestions => {
  const mergedQuestions: QuizComponentQuestions = [];
  quiz.forEach((topic) => {
    topic.questions.forEach((question) => {
      mergedQuestions.push({
        topic: topic.topic,
        difficulty: topic.difficulty,
        title: question.question,
        question: question,
      });
    });
  });
  return mergedQuestions;
};

export const QuizComponent: Component<QuizComponentProps> = ({ onCancel, onSubmit, quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = createSignal(0);
  const [responses, setResponses] = createSignal<QuizQuestionResponse[]>([]);
  const [quizComplete, setQuizComplete] = createSignal(false);

  const questionsArray = createMemo(() => {
    const numberOfQuestion = getStringValue("questionPerQuiz") || "10";
    const questionsNumber = parseInt(numberOfQuestion, 10);
    const allQuestions = mergeTopicsAndQuestions(quiz);
    const shuffleQuestions = shuffle(allQuestions);
    const output =
      shuffleQuestions.length > questionsNumber
        ? slice(shuffleQuestions, 0, questionsNumber)
        : shuffleQuestions;

    return output;
  });

  const currentQuestion = createMemo(() => questionsArray()[currentQuestionIndex()]);

  const handleNext = (response?: QuizQuestionResponse) => {
    if (response) {
      setResponses([...responses(), response]);
    }

    if (currentQuestionIndex() < questionsArray().length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex() + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const totalPoints = () => responses().reduce((sum, r) => sum + r.points, 0);

  return (
    <QuizContainer>
      <Show
        when={!quizComplete()}
        fallback={
          <QuizSummary responses={responses()} totalPoints={totalPoints()} onSubmit={onSubmit} />
        }
      >
        <Show when={currentQuestion()}>
          <QuizQuestion
            topic={currentQuestion().topic}
            difficulty={currentQuestion().difficulty}
            title={currentQuestion().title}
            question={currentQuestion().question}
            onNext={handleNext}
            onBack={onCancel}
          />
        </Show>
      </Show>
    </QuizContainer>
  );
};
