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
import {
  getBooleanValue,
  getLocalQuizes,
  getSelectedQuizes,
  getStringValue,
  saveLocalQuiz,
} from "./hooks/local";
import { fetchCdnAvailableQuizes, getCustomQuiz, getURLParams } from "./utils";
import { GameAbout } from "./components/game/GameAbout";
import { fetchOpenAIApi } from "./utils/llms/chatGPT";
import { getFormattedSystemPrompt } from "./utils/llms/prompt";
import { useTranslations } from "./hooks/translations";
import { getSelectedCombinedQuiz } from "./utils/quizes";
import { BattleGame } from "./components/battle/BattleGame";

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
  const [view, setView] = createSignal<
    | "menu"
    | "loading"
    | "start-single"
    | "start-battle"
    | "settings"
    | "load"
    | "save"
    | "generate"
    | "about"
  >("menu");
  const [fileQuizes, setFileQuizes] = createSignal<QuizInfo[]>([]);
  const [serverQuizes, setServerQuizes] = createSignal<QuizInfo[]>([]);
  const [cdnAvailableQuizes, setCdnAvailableQuizes] = createSignal<CdnQuizInfo[]>([]);
  const [selectedQuiz, setSelectedQuiz] = createSignal<QuizInfo>();
  const [customQuizUrl, setCustomQuizUrl] = createSignal<string>();
  const [selectedCustomQuiz, setSelectedCustomQuiz] = createSignal<QuizInfo>();
  const [isApp, setIsApp] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  const [language, setLanguage] = createSignal("");
  const [lastGeneration, setLastGeneration] = createSignal<string | null>(null);
  const [responseError, setResponseError] = createSignal<boolean>(false);
  const { getTranslation } = useTranslations();

  const systemLanguagePrompt = createMemo(() => {
    return getFormattedSystemPrompt(systemPrompt, language());
  });

  const selectedQuizData = createMemo(() => {
    return customQuizUrl() && selectedCustomQuiz()
      ? (selectedCustomQuiz() as QuizInfo)
      : (selectedQuiz() as QuizInfo);
  });

  const setSelectedQuizRequest = (callback: () => void = () => {}) => {
    const useServer = getBooleanValue("kvizolamma/useserver");
    const url = getStringValue("kvizolamma/serverurl");
    if (useServer && url) {
      getCustomQuiz(url, "server").then((data) => {
        setSelectedQuiz(data);
        callback();
      });
    } else {
      const localQuizes = getLocalQuizes();
      const selectedQuizes = getSelectedQuizes();
      getSelectedCombinedQuiz(selectedQuizes as SelectedQuizes, fileQuizes(), localQuizes).then(
        (data) => {
          setSelectedQuiz(data);
          callback();
        }
      );
    }
  };

  const goBackToMenu = () => setView("menu");

  onMount(async () => {
    const quizLanguage = getStringValue("kvizolamma/language");
    setLanguage(quizLanguage || "english");

    const isApp = await isTauri();
    setIsApp(isApp);
    if (isApp) {
      emit("get_quizes");
      emit("get_server_quizes");
    }
    fetchCdnAvailableQuizes().then((response) => {
      goBackToMenu();
      setCdnAvailableQuizes(response);
    });

    const customQuizUrl = getURLParams("quiz");
    if (customQuizUrl) {
      setCustomQuizUrl();
    }

    setMounted(true);
  });

  createEffect(() => {
    if (customQuizUrl()) {
      setCustomQuizUrl();
      setView("loading");
      const customQuizTitle = getURLParams("title");
      getCustomQuiz(customQuizUrl() as string, customQuizTitle || "custom").then((data) => {
        setSelectedCustomQuiz(data);
        goBackToMenu();
      });
    }
  });

  createEffect(() => {
    if (mounted()) {
      setSelectedQuizRequest();
    }
  });

  createEffect(async () => {
    if (!isApp()) return;
    const unlistenQuizes = await listen("quizes", (event: any) => {
      const responseQuizes = parseResponseJson(event.payload);

      setFileQuizes(responseQuizes);
      goBackToMenu();
    });

    return () => {
      unlistenQuizes();
    };
  });

  createEffect(async () => {
    if (!isApp()) return;
    const unlistenServerQuizes = await listen("server_quizes", (event: any) => {
      const responseQuizes = parseResponseJson(event.payload);

      setServerQuizes(responseQuizes);
    });

    return () => {
      unlistenServerQuizes();
    };
  });

  const handleGenerateQuiz = async (formData: GenerateFormData, options: GenerateFormOptions) => {
    setView("loading");

    if (options.type === "perplexity") {
      fetchPerplexityApi(options.api || "", systemLanguagePrompt(), formData)
        .then((response) => {
          const savedResponse = getStringValue(`kvizolamma/lastgeneration`);
          setResponseError(false);
          setLastGeneration(savedResponse);
          if (isApp()) {
            emit("save_quiz", { name: options.name, data: response });
            goBackToMenu();
          } else {
            saveLocalQuiz(options.name, JSON.stringify(response));
            goBackToMenu();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          const savedResponse = getStringValue(`kvizolamma/lastgeneration`);
          setLastGeneration(savedResponse);
          setResponseError(true);
          goBackToMenu();
        });
      return;
    }

    if (options.type === "chatgpt") {
      fetchOpenAIApi(options.api || "", systemLanguagePrompt(), formData, options.model)
        .then((response) => {
          const savedResponse = getStringValue(`kvizolamma/lastgeneration`);
          setResponseError(false);
          setLastGeneration(savedResponse);
          if (isApp()) {
            emit("save_quiz", { name: options.name, data: response });
            goBackToMenu();
          } else {
            saveLocalQuiz(options.name, JSON.stringify(response));
            goBackToMenu();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          const savedResponse = getStringValue(`kvizolamma/lastgeneration`);
          setLastGeneration(savedResponse);
          setResponseError(true);
          goBackToMenu();
        });
      return;
    }

    if (options.type === "ollama" && isApp()) {
      emit("generate_quiz", {
        ...formData,
        name: options.name,
        model: options.model,
        language: capitalize(language()),
      });
      goBackToMenu();
      return;
    }
  };

  const onLoadBack = () => {
    setView("loading");
    setSelectedQuizRequest(() => {
      goBackToMenu();
    });
  };

  return (
    <Container>
      <Header langugage={view() === "menu"} />
      <Show when={view() === "menu"}>
        <MenuContainer>
          <Menu>
            <MenuButton
              onClick={() => setView("start-single")}
              variant="contained"
              color="primary"
              disabled={isEmpty(selectedQuizData())}
            >
              {getTranslation("start_single_quiz")}
            </MenuButton>
            <MenuButton
              onClick={() => setView("start-battle")}
              variant="contained"
              color="primary"
              disabled={isEmpty(selectedQuizData())}
            >
              {getTranslation("battle_quiz")}
            </MenuButton>
            <MenuButton onClick={() => setView("settings")} variant="contained" color="primary">
              {getTranslation("settings")}
            </MenuButton>
            <MenuButton onClick={() => setView("load")} variant="contained" color="primary">
              {getTranslation("load")}
            </MenuButton>
            <MenuButton onClick={() => setView("save")} variant="contained" color="primary">
              {getTranslation("save")}
            </MenuButton>
            <MenuButton onClick={() => setView("generate")} variant="contained" color="primary">
              {getTranslation("generate")}
            </MenuButton>
            <MenuButton onClick={() => setView("about")} variant="contained" color="primary">
              {getTranslation("about")}
            </MenuButton>
            {!isEmpty(lastGeneration()) && (
              <MenuButton
                onClick={() => {
                  navigator.clipboard.writeText(lastGeneration() || "");
                }}
                variant="contained"
                color={responseError() ? "error" : "primary"}
              >
                {getTranslation("copy_response")}
              </MenuButton>
            )}
          </Menu>
        </MenuContainer>
      </Show>
      <Show when={view() === "loading"}>
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
      <Show when={view() === "start-single" && !isEmpty(selectedQuizData())}>
        <QuizGame quiz={selectedQuizData()} onBack={goBackToMenu} />
      </Show>
      <Show when={view() === "start-battle" && !isEmpty(selectedQuizData())}>
        <BattleGame quiz={selectedQuizData()} onBack={goBackToMenu} />
      </Show>
      <Show when={view() === "load"}>
        <QuizLoad
          cdnQuizes={cdnAvailableQuizes()}
          isApp={isApp()}
          fileQuizes={fileQuizes()}
          serverQuizes={serverQuizes()}
          onBack={onLoadBack}
        />
      </Show>
      <Show when={view() === "save"}>
        <QuizSave isApp={isApp()} onBack={goBackToMenu} />
      </Show>
      <Show when={view() === "settings"}>
        <GameSettings onBack={goBackToMenu} />
      </Show>
      <Show when={view() === "generate"}>
        <GenerateForm isApp={isApp()} onGenerate={handleGenerateQuiz} onBack={goBackToMenu} />
      </Show>
      <Show when={view() === "about"}>
        <GameAbout systemPrompt={systemLanguagePrompt()} onBack={goBackToMenu} />
      </Show>
      {getURLParams("footer") !== "hide" && <Footer />}
    </Container>
  );
};
