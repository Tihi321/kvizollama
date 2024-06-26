import { Component, createSignal, onMount, Show } from "solid-js";
import { Button } from "@suid/material";
import { Container } from "../layout/Container";
import { getStringValue, saveStringValue } from "../../hooks/local";
import { LocalTextInput } from "../layout/LocalTextInput";

interface QuizSettingsProps {
  onBack: () => void;
}

export const QuizSettings: Component<QuizSettingsProps> = ({ onBack }) => {
  const [perplexityApi, setPerplexityApi] = createSignal("");
  const [questionPerQuiz, setQuestionPerQuiz] = createSignal("");
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    const numberOfQuestion = getStringValue("questionPerQuiz");
    setQuestionPerQuiz(numberOfQuestion || "10");
    const localQuizes = getStringValue("perplexityApi");
    setPerplexityApi(localQuizes);
    setMounted(true);
  });

  return (
    <Container>
      <Show when={mounted()}>
        <LocalTextInput
          type="password"
          label="Perplexity API"
          value={perplexityApi()}
          onSave={(value) => {
            saveStringValue("perplexityApi", value);
            setPerplexityApi(value);
          }}
          onRemove={() => {
            setPerplexityApi("");
            saveStringValue("perplexityApi", "");
          }}
        />
        <LocalTextInput
          type="number"
          label="Questions per quiz"
          value={questionPerQuiz()}
          onSave={(value) => {
            saveStringValue("questionPerQuiz", value);
            setPerplexityApi(value);
          }}
          onRemove={() => {
            setQuestionPerQuiz("");
            saveStringValue("questionPerQuiz", "10");
          }}
        />
      </Show>

      <Button variant="contained" color="primary" onClick={onBack}>
        Back
      </Button>
    </Container>
  );
};
