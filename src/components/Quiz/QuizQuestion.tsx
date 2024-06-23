import { Component, createSignal, For, createMemo } from "solid-js";
import { styled } from "solid-styled-components";
import { Button, Card, CardContent, Typography } from "@suid/material";
import { Question, QuizQuestionResponse } from "../../types";

const QuestionCard = styled(Card)`
  margin-top: 20px;
`;

const QuestionContent = styled(CardContent)`
  padding: 24px;
`;

const TopicTitle = styled(Typography)`
  margin-bottom: 16px;
`;

const HintBox = styled("div")`
  background-color: #fff9c4;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 4px;
`;

const AnswerGrid = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

const AnswerButton = styled(Button)`
  height: 100%;
  text-transform: none;
  font-size: 16px;
`;

const ButtonContainer = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const ResultText = styled(Typography)<{ correct: boolean }>`
  color: ${(props) => (props.correct ? "#4caf50" : "#f44336")};
  font-weight: bold;
  margin-bottom: 8px;
`;

interface QuizQuestionProps {
  topic: string;
  difficulty: string;
  question: Question;
  onNext: (response: QuizQuestionResponse) => void;
}

export const QuizQuestion: Component<QuizQuestionProps> = (props) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = createSignal<number | null>(null);
  const [showHint, setShowHint] = createSignal(false);
  const [showResult, setShowResult] = createSignal(false);

  const selectedAnswer = createMemo(() => props.question.answers[selectedAnswerIndex()!]);

  const handleSubmit = () => {
    if (selectedAnswerIndex() === null) return;
    setShowResult(true);
  };

  return (
    <QuestionCard>
      <QuestionContent>
        <TopicTitle variant="h5">
          {props.topic} ({props.difficulty})
        </TopicTitle>
        <Typography variant="h6" gutterBottom>
          {props.question.question}
        </Typography>

        {showHint() && (
          <HintBox>
            <Typography>{props.question.hint}</Typography>
          </HintBox>
        )}

        {!showResult() && (
          <>
            <AnswerGrid>
              <For each={props.question.answers}>
                {(answer, index) => (
                  <AnswerButton
                    variant={selectedAnswerIndex() === index() ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedAnswerIndex(index())}
                    disabled={showResult()}
                  >
                    {answer.answer}
                  </AnswerButton>
                )}
              </For>
            </AnswerGrid>

            <ButtonContainer>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowHint(true)}
                disabled={showHint() || showResult()}
              >
                Show Hint
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={selectedAnswerIndex() === null || showResult()}
              >
                Submit
              </Button>
            </ButtonContainer>
          </>
        )}
        {showResult() && (
          <>
            <ResultText correct={selectedAnswer().correct} variant="h6">
              {selectedAnswer().correct ? "Correct!" : "Incorrect. Try again!"}
            </ResultText>
            <Typography>{props.question.explanation}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                props.onNext({
                  topic: props.topic,
                  question: props.question.question,
                  userAnswer: selectedAnswer().answer,
                  correctAnswer: props.question.answers.find((a) => a.correct)!.answer,
                  points: selectedAnswer().points,
                  correct: selectedAnswer().correct,
                });
                setSelectedAnswerIndex(null);
                setShowHint(false);
                setShowResult(false);
              }}
              style={{ marginTop: "16px", float: "right" }}
            >
              Next
            </Button>
          </>
        )}
      </QuestionContent>
    </QuestionCard>
  );
};
