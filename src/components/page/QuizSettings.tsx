import { Component, createSignal, onMount, Show } from "solid-js";
import { Button, FormControlLabel, Checkbox } from "@suid/material";
import { Container } from "../layout/Container";
import {
  getBooleanValue,
  getStringValue,
  saveBooleanValuee,
  saveStringValue,
} from "../../hooks/local";
import { LocalTextInput } from "../layout/LocalTextInput";
import { LocalSelectVoice } from "../layout/LocalSelectVoice";

interface QuizSettingsProps {
  onBack: () => void;
}

export const QuizSettings: Component<QuizSettingsProps> = ({ onBack }) => {
  const [perplexityApi, setPerplexityApi] = createSignal("");
  const [questionPerQuiz, setQuestionPerQuiz] = createSignal("");
  const [autoStartVoice, setAutoStartVoice] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    const numberOfQuestion = getStringValue("questionPerQuiz");
    setQuestionPerQuiz(numberOfQuestion || "10");
    const localQuizes = getStringValue("perplexityApi");
    setPerplexityApi(localQuizes);
    const autoStartVoice = getBooleanValue("autostartvoice");
    setAutoStartVoice(autoStartVoice);
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
        <LocalSelectVoice />
        <FormControlLabel
          control={
            <Checkbox
              checked={autoStartVoice()}
              onChange={(event: any) => {
                setAutoStartVoice(!event.target.checked);
                saveBooleanValuee("autostartvoice", !event.target.checked);
              }}
            />
          }
          label="Autostart voice"
        />
      </Show>

      <Button variant="contained" color="primary" onClick={onBack}>
        Back
      </Button>
    </Container>
  );
};
