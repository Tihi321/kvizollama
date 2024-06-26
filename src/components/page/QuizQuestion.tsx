import { Component, createSignal, For, createMemo, createEffect } from "solid-js";
import { styled } from "solid-styled-components";
import { Button, Typography } from "@suid/material";
import { Question, QuizQuestionResponse } from "../../types";

const QuestionCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const TopicTitle = styled(Typography)`
  margin-bottom: 16px;
`;

const HintBox = styled("div")`
  background-color: ${(props) => props?.theme?.colors.hint};
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

const ButtonContainer = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const ResultContainer = styled("div")`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const ResultText = styled(Typography)<{ correct: boolean }>`
  color: ${(props) =>
    props.correct ? props?.theme?.colors.correct : props?.theme?.colors.incorrect};
  font-weight: bold;
  margin-bottom: 8px;
`;

interface QuizQuestionProps {
  topic: string;
  difficulty: string;
  title: string;
  question: Question;
  onNext: (response: QuizQuestionResponse) => void;
}

export const QuizQuestion: Component<QuizQuestionProps> = (props) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = createSignal<number | null>(null);
  const [showHint, setShowHint] = createSignal(false);
  const [showResult, setShowResult] = createSignal(false);
  const [questionTitle, setQuestionTitle] = createSignal("");
  const [questionTopic, setQuestionTopc] = createSignal("");

  createEffect(() => {
    setSelectedAnswerIndex(null);
    setShowHint(false);
    setShowResult(false);
    setQuestionTitle(props.title);
    setQuestionTopc(props.topic);
  });

  const selectedAnswer = createMemo(() => props.question.answers[selectedAnswerIndex()!]);

  const handleSubmit = () => {
    if (selectedAnswerIndex() === null) return;
    setShowResult(true);
  };

  return (
    <QuestionCard>
      <Header>
        <TopicTitle variant="h6">
          {questionTopic()} ({props.difficulty})
        </TopicTitle>
        <Typography variant="h4" gutterBottom>
          {questionTitle()}
        </Typography>

        {showHint() && (
          <HintBox>
            <Typography>{props.question.hint}</Typography>
          </HintBox>
        )}
      </Header>

      {!showResult() && (
        <>
          <AnswerGrid>
            <For each={props.question.answers}>
              {(answer, index) => (
                <Button
                  variant={selectedAnswerIndex() === index() ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setSelectedAnswerIndex(index())}
                  disabled={showResult()}
                  sx={{ fontSize: "16px", padding: "16px", textTransform: "capitalize" }}
                >
                  {answer.answer}
                </Button>
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
        <ResultContainer>
          <ResultText correct={selectedAnswer().correct} variant="h6">
            {selectedAnswer().correct ? "Correct!" : "Incorrect. Try again!"}
          </ResultText>
          <Typography>{props.question.explanation}</Typography>
          <Button
            component="button"
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
            }}
            style={{ "margin-top": "16px" }}
          >
            Next
          </Button>
        </ResultContainer>
      )}
    </QuestionCard>
  );
};
