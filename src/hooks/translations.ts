import eng from "../translations/eng.json";
import hr from "../translations/hr.json";

import { createSignal, onMount } from "solid-js";
import { getStringValue } from "./local";
import { get } from "lodash";

export const useTranslations = () => {
  const [language, setLanguage] = createSignal("");

  onMount(async () => {
    const quizLanguage = getStringValue("language");
    setLanguage(quizLanguage || "english");
  });

  const getTranslation = (value: string) => {
    const values = language() === "english" ? eng : hr;

    return get(values, [value]);
  };

  return { getTranslation };
};
