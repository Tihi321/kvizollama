import { Component, createSignal, Show, createMemo } from "solid-js";
import { QuizQuestionResponse, Topics } from "../../types";
import { QuizQuestion } from "../quiz/QuizQuestion";
import { QuizSummary } from "../quiz/QuizSummary";
import { styled } from "solid-styled-components";

interface QuizProps {
  quiz: Topics[];
  onSubmit: () => void;
}

const QuizContainer = styled("div")`
  padding: 20px;
  flex: 1;
  display: flex;
`;

export const QuizComponent: Component<QuizProps> = (props) => {
  const [currentQuizIndex, setCurrentQuizIndex] = createSignal(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = createSignal(0);
  const [responses, setResponses] = createSignal<QuizQuestionResponse[]>([]);
  const [quizComplete, setQuizComplete] = createSignal(false);

  const currentQuiz = createMemo(() => props.quiz[currentQuizIndex()]);
  const currentQuestion = createMemo(() => currentQuiz().questions[currentQuestionIndex()]);

  const handleNext = (response?: QuizQuestionResponse) => {
    if (response) {
      setResponses([...responses(), response]);
    }

    if (currentQuestionIndex() < currentQuiz().questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex() + 1);
    } else if (currentQuizIndex() < props.quiz.length - 1) {
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
          <QuizSummary
            responses={responses()}
            totalPoints={totalPoints()}
            onSubmit={props.onSubmit}
          />
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
    </QuizContainer>
  );
};
