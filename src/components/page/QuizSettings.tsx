import { Component, createSignal, onMount, Show } from "solid-js";
import { Button, FormControlLabel, Checkbox } from "@suid/material";
import { Container } from "../layout/Container";
import {
  getBooleanValue,
  getStringValue,
  saveBooleanValue,
  saveStringValue,
} from "../../hooks/local";
import { LocalTextInput } from "../layout/LocalTextInput";
import { LocalSelectVoice } from "../layout/LocalSelectVoice";
import { Back } from "../icons/Back";
import { useTranslations } from "../../hooks/translations";

interface QuizSettingsProps {
  onBack: () => void;
}

export const QuizSettings: Component<QuizSettingsProps> = ({ onBack }) => {
  const [perplexityApi, setPerplexityApi] = createSignal("");
  const [chatGPTApi, setChatGPTApi] = createSignal("");
  const [questionPerQuiz, setQuestionPerQuiz] = createSignal("");
  const [autoStartVoice, setAutoStartVoice] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  const { getTranslation } = useTranslations();

  onMount(() => {
    const numberOfQuestion = getStringValue("questionPerQuiz");
    setQuestionPerQuiz(numberOfQuestion || "10");
    const perplexityApi = getStringValue("perplexityApi");
    setPerplexityApi(perplexityApi);
    const chatGPTApi = getStringValue("chatgptAPI");
    setChatGPTApi(chatGPTApi);
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
          type="password"
          label="ChatGPT API"
          value={chatGPTApi()}
          onSave={(value) => {
            saveStringValue("chatgptAPI", value);
            setChatGPTApi(value);
          }}
          onRemove={() => {
            setChatGPTApi("");
            saveStringValue("chatgptAPI", "");
          }}
        />
        <LocalTextInput
          type="number"
          label={getTranslation("questions_per_quiz")}
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
                const checked = !event.target.checked;
                setAutoStartVoice(checked);
                saveBooleanValue("autostartvoice", checked);
              }}
            />
          }
          label={getTranslation("autostart_voice")}
        />
      </Show>

      <Button variant="contained" color="info" onClick={onBack}>
        <Back />
      </Button>
    </Container>
  );
};
