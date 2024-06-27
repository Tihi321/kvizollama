import { Component, createSignal, For, createMemo, createEffect, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import { Button, Typography, IconButton, SvgIcon } from "@suid/material";
import { Question, QuizQuestionResponse } from "../../types";
import { getVoice, getVoices } from "../../utils";
import { getBooleanValue, getStringValue } from "../../hooks/local";
import { isUndefined } from "lodash";

const QuestionCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const IconButtonStyled = styled(IconButton)`
  position: absolute;
  top: 20px;
  right: 20px;
  svg {
    width: 24px;
  }
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
  margin-top: 10px;
  gap: 8px;
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
    props?.correct ? props?.theme?.colors.correct : props?.theme?.colors.incorrect};
  font-weight: bold;
  margin-bottom: 8px;
`;

interface QuizQuestionProps {
  topic: string;
  difficulty: string;
  title: string;
  question: Question;
  onNext: (response: QuizQuestionResponse) => void;
  onBack: () => void;
}

export const QuizQuestion: Component<QuizQuestionProps> = (props) => {
  const { onBack, onNext, topic, question, difficulty, title } = props;
  const [mounted, setMounted] = createSignal(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = createSignal<number | null>(null);
  const [showHint, setShowHint] = createSignal(false);
  const [showResult, setShowResult] = createSignal(false);
  const [questionTitle, setQuestionTitle] = createSignal("");
  const [questionTopic, setQuestionTopc] = createSignal("");
  const [autoStartVoice, setAutoStartVoice] = createSignal(false);
  const [selectedVoice, setSelectedVoice] = createSignal<string>();
  const [availableVoices, setAvailableVoices] = createSignal<SpeechSynthesisVoice[]>([]);
  let speaker: SpeechSynthesisUtterance | null = null;

  onMount(() => {
    speaker = new SpeechSynthesisUtterance();
    const voice = getStringValue("selectedVoice");
    setSelectedVoice(voice || "");
    const autoStartVoice = getBooleanValue("autostartvoice");
    setAutoStartVoice(autoStartVoice);
    setMounted(true);
  });

  createEffect(() => {
    if (mounted()) {
      const voices = getVoices();
      setAvailableVoices(voices);
    }
  });

  createEffect(() => {
    if (!isUndefined(selectedVoice()) && speaker) {
      const voice = getVoice(selectedVoice() || "", availableVoices());
      if (voice) {
        speaker.voice = voice;
        speaker.lang = voice.lang;
      }
      speaker.text = props.title;

      if (autoStartVoice()) {
        speechSynthesis.speak(speaker);
      }
    }
  });

  const stopSpeaking = () => {
    if (!speaker) return;
    speechSynthesis.cancel();
  };

  const speak = () => {
    if (!speaker) return;
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    } else {
      speechSynthesis.speak(speaker);
    }
  };

  createEffect(() => {
    stopSpeaking();
    setSelectedAnswerIndex(null);
    setShowHint(false);
    setShowResult(false);
    setQuestionTitle(props.title);
    setQuestionTopc(props.topic);
  });

  const selectedAnswer = createMemo(() => question.answers[selectedAnswerIndex()!]);

  const handleSubmit = () => {
    stopSpeaking();
    if (selectedAnswerIndex() === null) return;
    setShowResult(true);
  };

  return (
    <QuestionCard>
      {!showResult() && (
        <Header>
          <IconButtonStyled aria-label="toggle volume" onClick={speak}>
            <SvgIcon viewBox="0 0 20 20">
              <path
                d="M7.5 4c.18 0 .34.1.43.25l.04.08 4 11a.5.5 0 01-.9.42l-.04-.08L9.7 12H5.3l-1.33 3.67a.5.5 0 01-.96-.25l.02-.1 4-11A.5.5 0 017.5 4zm0 1.96L5.67 11h3.66L7.5 5.96zm5.24-3.9l.39.22a9.5 9.5 0 014.84 7.36l.03.31a.5.5 0 01-1 .1l-.03-.32a8.5 8.5 0 00-4.33-6.58l-.38-.21a.5.5 0 01.48-.88zm-1.17 2.68a.5.5 0 01.6-.2l.09.03.12.08a6.5 6.5 0 013.02 4.23l.05.27.04.27a.5.5 0 01-.96.25l-.02-.09-.05-.26a5.5 5.5 0 00-2.37-3.67l-.22-.15-.13-.07a.5.5 0 01-.17-.69z"
                fill-rule="nonzero"
                data-astro-cid-gvpn4u4b=""
              ></path>
            </SvgIcon>
          </IconButtonStyled>

          <TopicTitle variant="h6">
            {questionTopic()} ({difficulty})
          </TopicTitle>
          <Typography variant="h4" gutterBottom>
            {questionTitle()}
          </Typography>
          {showHint() && (
            <HintBox>
              <Typography>{question.hint}</Typography>
            </HintBox>
          )}
        </Header>
      )}
      {!showResult() && (
        <>
          <AnswerGrid>
            <For each={question.answers}>
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
            <Button variant="contained" color="primary" onClick={onBack}>
              Back
            </Button>
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
          <Typography>{question.explanation}</Typography>
          <ButtonContainer>
            <Button variant="contained" color="primary" onClick={onBack}>
              Back
            </Button>
            <Button
              component="button"
              variant="contained"
              color="primary"
              onClick={() => {
                onNext({
                  topic: topic,
                  question: question.question,
                  userAnswer: selectedAnswer().answer,
                  correctAnswer: question.answers.find((a) => a.correct)!.answer,
                  points: selectedAnswer().points,
                  correct: selectedAnswer().correct,
                });
              }}
            >
              Next
            </Button>
          </ButtonContainer>
        </ResultContainer>
      )}
    </QuestionCard>
  );
};
