import { Component, createSignal, onMount, Show } from "solid-js";
import { Button } from "@suid/material";
import { Container } from "../layout/Container";
import { getStringValue, saveStringValue } from "../../hooks/local";
import { LocalTextInput } from "../layout/LocalTextInput";
import { Back } from "../icons/Back";
import { useTranslations } from "../../hooks/translations";

interface QuizSettingsProps {
  onBack: () => void;
}

export const QuizSettings: Component<QuizSettingsProps> = ({ onBack }) => {
  const [questionPerQuiz, setQuestionPerQuiz] = createSignal("");
  const [mounted, setMounted] = createSignal(false);
  const { getTranslation } = useTranslations();

  onMount(() => {
    const numberOfQuestion = getStringValue("questionPerQuiz");
    setQuestionPerQuiz(numberOfQuestion || "10");
    setMounted(true);
  });

  return (
    <Container>
      <Show when={mounted()}>
        <LocalTextInput
          type="number"
          label={getTranslation("questions_per_quiz")}
          value={questionPerQuiz()}
          onSave={(value) => {
            saveStringValue("questionPerQuiz", value);
          }}
          onRemove={() => {
            setQuestionPerQuiz("");
            saveStringValue("questionPerQuiz", "10");
          }}
        />
      </Show>

      <Button variant="contained" color="info" onClick={onBack}>
        <Back />
      </Button>
    </Container>
  );
};
