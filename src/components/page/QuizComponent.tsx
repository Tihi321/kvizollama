import { Component, createSignal, Show, createMemo } from "solid-js";
import { QuizQuestionResponse, Topics } from "../../types";
import { QuizQuestion } from "./QuizQuestion";
import { QuizSummary } from "./QuizSummary";
import { styled } from "solid-styled-components";
import { Button } from "@suid/material";

interface QuizComponentProps {
  quiz: Topics[];
  onSubmit: () => void;
  onCancel: () => void;
}

const QuizContainer = styled("div")`
  position: relative;
  padding: 20px;
  flex: 1;
  display: flex;
`;

const ButtonBack = styled(Button)`
  position: absolute !important;
  top: 20px;
  left: 20px;
  width: 100px;
`;

export const QuizComponent: Component<QuizComponentProps> = ({ onCancel, onSubmit, quiz }) => {
  const [currentQuizIndex, setCurrentQuizIndex] = createSignal(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = createSignal(0);
  const [responses, setResponses] = createSignal<QuizQuestionResponse[]>([]);
  const [quizComplete, setQuizComplete] = createSignal(false);

  const currentQuiz = createMemo(() => quiz[currentQuizIndex()]);
  const currentQuestion = createMemo(() => currentQuiz().questions[currentQuestionIndex()]);

  const handleNext = (response?: QuizQuestionResponse) => {
    if (response) {
      setResponses([...responses(), response]);
    }

    if (currentQuestionIndex() < currentQuiz().questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex() + 1);
    } else if (currentQuizIndex() < quiz.length - 1) {
      setCurrentQuizIndex(currentQuizIndex() + 1);
      setCurrentQuestionIndex(0);
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
        <Show when={currentQuiz() && currentQuestion()}>
          <QuizQuestion
            topic={currentQuiz().topic}
            difficulty={currentQuiz().difficulty}
            title={currentQuestion().question}
            question={currentQuestion()}
            onNext={handleNext}
          />
        </Show>
      </Show>
      <ButtonBack onClick={onCancel} variant="contained" color="primary">
        Back
      </ButtonBack>
    </QuizContainer>
  );
};
