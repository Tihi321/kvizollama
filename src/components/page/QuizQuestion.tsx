import { Component, createSignal, For, createMemo, createEffect, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import { Button } from "@suid/material";
import { Question, QuizQuestionResponse } from "../../types";
import { getVoice, getVoices } from "../../utils";
import { getBooleanValue, getStringValue } from "../../hooks/local";
import { isUndefined } from "lodash";
import { QuestionHeader } from "../layout/QuestionHeader";
import { Back } from "../icons/Back";
import { Next } from "../icons/Next";
import { useTranslations } from "../../hooks/translations";

const QuestionCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const AnswerGrid = styled("div")`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  margin-bottom: 16px;

  @media (min-width: 700px) {
    gap: 16px;
    grid-template-columns: 1fr 1fr;
  }
`;

const ButtonContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  gap: 8px;
  flex-direction: column;

  @media (min-width: 700px) {
    flex-direction: row;
  }
`;

const AnswerButton = styled(Button)`
  font-size: 16px !important;
  padding: 8px !important;
  text-transform: capitalize !important;

  @media (min-width: 700px) {
    padding: 16px !important;
    font-size: 24px !important;
  }
`;

const ResultContainer = styled("div")`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const ResultText = styled("h4")<{ correct: boolean }>`
  color: ${(props) =>
    props?.correct ? props?.theme?.colors.correct : props?.theme?.colors.incorrect};
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 24px;

  @media (min-width: 700px) {
    font-size: 32px;
  }
`;

const ResultExplanation = styled("div")`
  text-align: center;
  font-size: 16px;
  margin-bottom: 16px;

  @media (min-width: 700px) {
    font-size: 18px;
  }
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
  const [title, setTitle] = createSignal<string>("");
  const [mounted, setMounted] = createSignal(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = createSignal<number | null>(null);
  const [showHint, setShowHint] = createSignal(false);
  const [showResult, setShowResult] = createSignal(false);
  const [autoStartVoice, setAutoStartVoice] = createSignal(false);
  const [selectedVoice, setSelectedVoice] = createSignal<string>();
  const [availableVoices, setAvailableVoices] = createSignal<SpeechSynthesisVoice[]>([]);
  let speaker: SpeechSynthesisUtterance | null = null;
  const { getTranslation } = useTranslations();

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
    }
  });

  const stopSpeaking = () => {
    if (!speaker) return;
    speechSynthesis.cancel();
  };

  const speak = () => {
    if (!speaker) return;
    speaker.text = props.title;
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

    if (autoStartVoice() && speaker && props.title) {
      speaker.text = props.title;
      speechSynthesis.speak(speaker);
    }

    setTitle(props.title);
  });

  const selectedAnswer = createMemo(() => props.question.answers[selectedAnswerIndex()!]);

  const handleSubmit = () => {
    stopSpeaking();
    if (selectedAnswerIndex() === null) return;
    setShowResult(true);
  };

  return (
    <QuestionCard>
      {!showResult() && (
        <QuestionHeader
          difficulty={props.difficulty}
          topic={props.topic}
          hint={props.question.hint}
          title={title()}
          showHint={showHint()}
          onSpeak={speak}
        />
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
                >
                  {answer.answer}
                </AnswerButton>
              )}
            </For>
          </AnswerGrid>
          <ButtonContainer>
            <Button variant="contained" color="info" onClick={props.onBack}>
              <Back />
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowHint(true)}
              disabled={showHint() || showResult()}
            >
              {getTranslation("show_hint")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={selectedAnswerIndex() === null || showResult()}
            >
              <Next />
            </Button>
          </ButtonContainer>
        </>
      )}
      {showResult() && (
        <ResultContainer>
          <ResultText correct={selectedAnswer().correct}>
            {selectedAnswer().correct
              ? getTranslation("answered_correct")
              : getTranslation("answered_incorrect")}
          </ResultText>
          <ResultExplanation>{props.question.explanation}</ResultExplanation>
          <ButtonContainer>
            <Button size="large" variant="contained" color="info" onClick={props.onBack}>
              <Back />
            </Button>
            <Button
              size="large"
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
            >
              {getTranslation("next_question")}
            </Button>
          </ButtonContainer>
        </ResultContainer>
      )}
    </QuestionCard>
  );
};
