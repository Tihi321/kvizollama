import { Component, createSignal, For, createEffect, onMount } from "solid-js";
import { Button, Typography } from "@suid/material";
import { Answer } from "../../types";
import { getVoice, getVoices } from "../../utils";
import { getBooleanValue, getStringValue } from "../../hooks/local";
import { isUndefined } from "lodash";
import {
  AnswerButton,
  ExplanationText,
  IconButtonStyled,
  ModalAnswers,
  ModalContent,
  ModalQuestion,
  ModalQuestionInfo,
  ModalTitle,
} from "./ModalPieces";
import { Echo } from "../icons/Echo";
import { Close } from "../icons/Close";
import { useTranslations } from "../../hooks/translations";
import { getDifficultyTranslationString } from "../../utils/translations";

interface BattleQuestionProps {
  topic?: string;
  difficulty?: string;
  question?: string;
  explanation?: string;
  answers?: Answer[];
  correct: boolean | null;
  showExplanation?: boolean;
  onAnswerSelect: (answerIndex: number) => void;
  onClose: () => void;
  isAttacking: "none" | "flag" | "soldier";
  correctAnswers: number;
  onNextQuestion: () => void;
  onFinish: () => void;
}

export const BattleQuestion: Component<BattleQuestionProps> = (props) => {
  const { getTranslation } = useTranslations();
  const [mounted, setMounted] = createSignal(false);
  const [autoStartVoice, setAutoStartVoice] = createSignal(false);
  const [selectedVoice, setSelectedVoice] = createSignal<string>();
  const [availableVoices, setAvailableVoices] = createSignal<SpeechSynthesisVoice[]>([]);
  let speaker: SpeechSynthesisUtterance | null = null;

  onMount(() => {
    speaker = new SpeechSynthesisUtterance();
    const voice = getStringValue("kvizolamma/selectedVoice");
    setSelectedVoice(voice || "");
    const autoStartVoice = getBooleanValue("kvizolamma/autostartvoice");
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

        if (autoStartVoice() && props.question) {
          speaker.text = props.question;
          speechSynthesis.speak(speaker);
        }
      }
    }
  });

  const stopSpeaking = () => {
    if (!speaker) return;
    speechSynthesis.cancel();
  };

  const speak = () => {
    if (!speaker || !props.question) return;
    speaker.text = props.question;
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    } else {
      speechSynthesis.speak(speaker);
    }
  };

  const handleClose = () => {
    if (props.showExplanation) {
      if (props.correct) {
        if (props.correctAnswers === (props.isAttacking !== "none" ? 2 : 1)) {
          // Move was successful, close and go to next player
          props.onClose();
        } else {
          // Need another correct answer, open next question
          props.onNextQuestion();
        }
      } else {
        // Incorrect answer, close and go to next player
        props.onClose();
      }
    } else {
      // Question not answered yet, just close
      props.onClose();
    }
  };

  const handleFinish = () => {
    props.onFinish();
  };

  return (
    <ModalContent>
      <ModalTitle>
        <h2>
          {props.topic} ({getTranslation(getDifficultyTranslationString(props.difficulty || ""))})
        </h2>

        {props.showExplanation &&
        props.correct &&
        props.correctAnswers === (props.isAttacking !== "none" ? 2 : 1) ? (
          <Button variant="contained" color="primary" onClick={handleFinish}>
            Finish
          </Button>
        ) : (
          <Button variant="contained" color="warning" onClick={handleClose}>
            <Close />
          </Button>
        )}
      </ModalTitle>

      <ModalQuestionInfo>
        {!props.showExplanation && (
          <IconButtonStyled aria-label="toggle volume" onClick={speak}>
            <Echo />
          </IconButtonStyled>
        )}
        <ModalQuestion>{props.question}</ModalQuestion>
        {props.isAttacking !== "none" && (
          <Typography variant="body2" sx={{ marginTop: "10px" }}>
            {props.isAttacking === "flag" ? "Attacking flag" : "Attacking soldier"}:{" "}
            {props.correctAnswers}/2 correct answers
          </Typography>
        )}
        {props.showExplanation && (
          <>
            <Typography variant="h6" color={props.correct ? "green" : "red"}>
              {props.correct ? "Correct!" : "Incorrect!"}
            </Typography>
            {props.correct && <ExplanationText>{props.explanation}</ExplanationText>}
          </>
        )}
      </ModalQuestionInfo>

      {!props.showExplanation && (
        <ModalAnswers>
          <For each={props.answers}>
            {(answer, index) => (
              <AnswerButton
                style={{ order: Math.floor(Math.random() * 11) }}
                onClick={() => {
                  stopSpeaking();
                  props.onAnswerSelect(index());
                }}
              >
                {answer.answer}
              </AnswerButton>
            )}
          </For>
        </ModalAnswers>
      )}
    </ModalContent>
  );
};
