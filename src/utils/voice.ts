import { filter, find, head } from "lodash";
import { LANGUAGES } from "../constants";

export const getVoices = () => {
  const voices = speechSynthesis.getVoices();
  return filter(voices, (voice) => LANGUAGES.includes(voice.lang));
};

export const getVoice = (name: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice => {
  const voice = find(voices, (voices) => voices.name === name);
  return voice || (head(voices) as SpeechSynthesisVoice);
};
