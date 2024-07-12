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

interface GameSettingsProps {
  onBack: () => void;
}

export const GameSettings: Component<GameSettingsProps> = ({ onBack }) => {
  const [perplexityApi, setPerplexityApi] = createSignal("");
  const [chatGPTApi, setChatGPTApi] = createSignal("");
  const [autoStartVoice, setAutoStartVoice] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  const { getTranslation } = useTranslations();

  onMount(() => {
    const perplexityApi = getStringValue("kvizolamma/perplexityApi");
    setPerplexityApi(perplexityApi);
    const chatGPTApi = getStringValue("kvizolamma/chatgptAPI");
    setChatGPTApi(chatGPTApi);
    const autoStartVoice = getBooleanValue("kvizolamma/autostartvoice");
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
