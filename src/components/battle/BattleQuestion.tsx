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
  isAttackingFlag: boolean;
  correctAnswers: number;
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

  return (
    <ModalContent>
      <ModalTitle>
        <h2>
          {props.topic} ({getTranslation(getDifficultyTranslationString(props.difficulty || ""))})
        </h2>
        <Button variant="contained" color="warning" onClick={props.onClose}>
          <Close />
        </Button>
      </ModalTitle>

      <ModalQuestionInfo>
        {!props.showExplanation && (
          <IconButtonStyled aria-label="toggle volume" onClick={speak}>
            <Echo />
          </IconButtonStyled>
        )}
        <ModalQuestion>{props.question}</ModalQuestion>
        {props.isAttackingFlag && (
          <Typography variant="body2" sx={{ marginTop: "10px" }}>
            Attacking flag: {props.correctAnswers}/2 correct answers
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
