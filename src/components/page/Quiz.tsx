import { Component, createSignal, Show, createMemo } from "solid-js";
import { QuizQuestionResponse, Topic } from "../../types";
import { QuizQuestion } from "../quiz/QuizQuestion";
import { QuizSummary } from "../quiz/QuizSummary";
import { styled } from "solid-styled-components";

interface QuizProps {
  topics: Topic[];
  onSubmit: () => void;
}

const QuizContainer = styled("div")`
  padding: 20px;
  flex: 1;
  display: flex;
`;

export const Quiz: Component<QuizProps> = (props) => {
  const [currentTopicIndex, setCurrentTopicIndex] = createSignal(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = createSignal(0);
  const [responses, setResponses] = createSignal<QuizQuestionResponse[]>([]);
  const [quizComplete, setQuizComplete] = createSignal(false);

  const currentTopic = createMemo(() => props.topics[currentTopicIndex()]);
  const currentQuestion = createMemo(() => currentTopic().questions[currentQuestionIndex()]);

  const handleNext = (response?: QuizQuestionResponse) => {
    if (response) {
      setResponses([...responses(), response]);
    }

    if (currentQuestionIndex() < currentTopic().questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex() + 1);
    } else if (currentTopicIndex() < props.topics.length - 1) {
      setCurrentTopicIndex(currentTopicIndex() + 1);
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
        <Show when={currentTopic() && currentQuestion()}>
          <QuizQuestion
            topic={currentTopic().topic}
            difficulty={currentTopic().difficulty}
            title={currentQuestion().question}
            question={currentQuestion()}
            onNext={handleNext}
          />
        </Show>
      </Show>
    </QuizContainer>
  );
};
