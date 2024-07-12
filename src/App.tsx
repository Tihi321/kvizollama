// @ts-ignore
import systemPrompt from "../assets/system_prompt.txt?raw";

import { createEffect, createSignal, Show, createMemo, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import { CircularProgress, Box, Button } from "@suid/material";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { emit, listen } from "@tauri-apps/api/event";
import {
  GenerateFormData,
  QuizInfo,
  GenerateFormOptions,
  CdnQuizInfo,
  SelectedQuizes,
} from "./types";
import { QuizGame } from "./components/single/QuizGame";
import { GenerateForm } from "./components/game/GenerateForm";
import { capitalize, isEmpty } from "lodash";
import { isTauri } from "./utils/enviroment";
import { QuizLoad } from "./components/game/QuizLoad";
import { parseResponseJson } from "./utils/response";
import { QuizSave } from "./components/game/QuizSave";
import { GameSettings } from "./components/game/GameSettings";
import { fetchPerplexityApi } from "./utils/llms";
import { getLocalQuizes, getSelectedQuizes, getStringValue, saveLocalQuiz } from "./hooks/local";
import { fetchCdnAvailableQuizes, getCustomQuiz, getQuizTitle, getQuizmUrl } from "./utils";
import { GameAbout } from "./components/game/GameAbout";
import { fetchOpenAIApi } from "./utils/llms/chatGPT";
import { getFormattedSystemPrompt } from "./utils/llms/prompt";
import { useTranslations } from "./hooks/translations";
import { getSelectedCombinedQuiz } from "./utils/quizes";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MenuContainer = styled("div")`
  display: flex;
  flex: 1;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Menu = styled("div")`
  display: flex;
  flex: 1;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
`;

const MenuButton = styled(Button)`
  width: 300px;
`;

export const App = () => {
  const [fileQuizes, setFileQuizes] = createSignal<QuizInfo[]>([]);
  const [cdnAvailableQuizes, setCdnAvailableQuizes] = createSignal<CdnQuizInfo[]>([]);
  const [selectedQuiz, setSelectedQuiz] = createSignal<QuizInfo>();
  const [customQuizUrl, setCustomQuizUrl] = createSignal<string>();
  const [selectedCustomQuiz, setSelectedCustomQuiz] = createSignal<QuizInfo>();
  const [generateQuiz, setGenerateQuiz] = createSignal(false);
  const [aboutQuiz, setAboutQuiz] = createSignal(false);
  const [showLoadQuiz, setShowLoadQuiz] = createSignal(false);
  const [showSaveQuiz, setShowSaveQuiz] = createSignal(false);
  const [showSettingsQuiz, setShowSettingsQuiz] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [isApp, setIsApp] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  const [language, setLanguage] = createSignal("");
  const [selectedQuizes, setSelectedQuizes] = createSignal<SelectedQuizes>();
  const [singleQuizStarted, setSingleQuizStarted] = createSignal(false);
  const { getTranslation } = useTranslations();

  const systemLanguagePrompt = createMemo(() => {
    return getFormattedSystemPrompt(systemPrompt, language());
  });

  const singleSelectedQuiz = createMemo(() => {
    return customQuizUrl() && selectedCustomQuiz()
      ? (selectedCustomQuiz() as QuizInfo)
      : (selectedQuiz() as QuizInfo);
  });

  const isHomepage = createMemo(() => {
    return !singleQuizStarted();
  });

  const showStart = createMemo(
    () =>
      !singleQuizStarted() &&
      !generateQuiz() &&
      !loading() &&
      !showLoadQuiz() &&
      !showSaveQuiz() &&
      !aboutQuiz() &&
      !showSettingsQuiz()
  );

  onMount(async () => {
    const selectedQuizes = getSelectedQuizes();
    setSelectedQuizes(selectedQuizes);

    const quizLanguage = getStringValue("kvizolamma/language");
    setLanguage(quizLanguage || "english");

    const isApp = await isTauri();
    setIsApp(isApp);
    if (isApp) {
      emit("get_quizes");
    }
    fetchCdnAvailableQuizes().then((response) => {
      setLoading(false);
      setCdnAvailableQuizes(response);
    });

    const customQuizUrl = getQuizmUrl();
    if (customQuizUrl) {
      setCustomQuizUrl();
    }

    setMounted(true);
  });

  createEffect(() => {
    if (customQuizUrl()) {
      setCustomQuizUrl();
      setShowLoadQuiz(false);
      setLoading(true);
      const customQuizTitle = getQuizTitle();
      getCustomQuiz(customQuizUrl() as string, customQuizTitle || "custom").then((data) => {
        setSelectedCustomQuiz(data);
        setLoading(false);
      });
    }
  });

  createEffect(() => {
    if (mounted()) {
      const localQuizes = getLocalQuizes();
      getSelectedCombinedQuiz(selectedQuizes() as SelectedQuizes, fileQuizes(), localQuizes).then(
        (data) => {
          setSelectedQuiz(data);
        }
      );
    }
  });

  createEffect(async () => {
    if (!isApp()) return;
    const unlisten = await listen("quizes", (event: any) => {
      const responseQuizes = parseResponseJson(event.payload);

      setFileQuizes(responseQuizes);
      setLoading(false);
    });

    return () => unlisten();
  });

  const handleGenerateQuiz = async (formData: GenerateFormData, options: GenerateFormOptions) => {
    setGenerateQuiz(false);
    setLoading(true);

    if (options.type === "perplexity") {
      fetchPerplexityApi(options.api || "", systemLanguagePrompt(), formData).then((response) => {
        if (isApp()) {
          emit("save_quiz", { name: options.name, data: response });
          setLoading(false);
        } else {
          saveLocalQuiz(options.name, JSON.stringify(response));
          setLoading(false);
        }
      });
      return;
    }

    if (options.type === "chatgpt") {
      fetchOpenAIApi(options.api || "", systemLanguagePrompt(), formData, options.model).then(
        (response) => {
          if (isApp()) {
            emit("save_quiz", { name: options.name, data: response });
            setLoading(false);
          } else {
            saveLocalQuiz(options.name, JSON.stringify(response));
            setLoading(false);
          }
        }
      );
      return;
    }

    if (options.type === "ollama" && isApp()) {
      emit("generate_quiz", {
        ...formData,
        name: options.name,
        model: options.model,
        language: capitalize(language()),
      });
      setGenerateQuiz(false);
      return;
    }
  };

  const onLoadBack = () => {
    setLoading(true);
    setShowLoadQuiz(false);
    const localQuizes = getLocalQuizes();
    getSelectedCombinedQuiz(selectedQuizes() as SelectedQuizes, fileQuizes(), localQuizes).then(
      (data) => {
        setLoading(false);
        setSelectedQuiz(data);
      }
    );
  };

  return (
    <Container>
      <Header langugage={isHomepage()} />
      <Show when={showStart()}>
        <MenuContainer>
          <Menu>
            <MenuButton
              onClick={() => setSingleQuizStarted(true)}
              variant="contained"
              color="primary"
              disabled={isEmpty(selectedQuiz())}
            >
              {getTranslation("start_single_quiz")}
            </MenuButton>
            <MenuButton
              onClick={() => setShowSettingsQuiz(true)}
              variant="contained"
              color="primary"
            >
              {getTranslation("settings")}
            </MenuButton>
            <MenuButton onClick={() => setShowLoadQuiz(true)} variant="contained" color="primary">
              {getTranslation("load")}
            </MenuButton>
            <MenuButton onClick={() => setShowSaveQuiz(true)} variant="contained" color="primary">
              {getTranslation("save")}
            </MenuButton>
            <MenuButton onClick={() => setGenerateQuiz(true)} variant="contained" color="primary">
              {getTranslation("generate")}
            </MenuButton>
            <MenuButton onClick={() => setAboutQuiz(true)} variant="contained" color="primary">
              {getTranslation("about")}
            </MenuButton>
          </Menu>
        </MenuContainer>
      </Show>
      <Show when={loading()}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      </Show>
      <Show when={singleQuizStarted() && !isEmpty(singleSelectedQuiz())}>
        <QuizGame quiz={singleSelectedQuiz()} onBack={() => setSingleQuizStarted(false)} />
      </Show>
      <Show when={showLoadQuiz()}>
        <QuizLoad
          cdnQuizes={cdnAvailableQuizes()}
          isApp={isApp()}
          fileQuizes={fileQuizes()}
          onBack={onLoadBack}
        />
      </Show>
      <Show when={showSaveQuiz()}>
        <QuizSave isApp={isApp()} onBack={() => setShowSaveQuiz(false)} />
      </Show>
      <Show when={showSettingsQuiz()}>
        <GameSettings onBack={() => setShowSettingsQuiz(false)} />
      </Show>
      <Show when={generateQuiz()}>
        <GenerateForm
          isApp={isApp()}
          onGenerate={handleGenerateQuiz}
          onBack={() => setGenerateQuiz(false)}
        />
      </Show>
      <Show when={aboutQuiz()}>
        <GameAbout systemPrompt={systemLanguagePrompt()} onBack={() => setAboutQuiz(false)} />
      </Show>
      <Footer />
    </Container>
  );
};
