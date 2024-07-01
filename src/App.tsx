// @ts-ignore
import systemPrompt from "../assets/system_prompt.txt?raw";

import { createEffect, createSignal, Show, createMemo, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import { CircularProgress, Box, Button } from "@suid/material";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { emit, listen } from "@tauri-apps/api/event";
import { QuizFormData, Topics, QuizInfo, QuizFormOptions, CdnQuizInfo } from "./types";
import { QuizComponent } from "./components/page/QuizComponent";
import { QuizForm } from "./components/page/QuizForm";
import { capitalize, isEmpty } from "lodash";
import { isTauri } from "./utils/enviroment";
import { QuizLoad } from "./components/page/QuizLoad";
import { parseResponseJson } from "./utils/response";
import { QuizSave } from "./components/page/QuizSave";
import { QuizSettings } from "./components/page/QuizSettings";
import { fetchPerplexityApi } from "./utils/llms";
import { getStringValue, saveLocalQuiz } from "./hooks/local";
import {
  fetchCdnAvailableQuizes,
  getCdnQuiz,
  getCustomQuiz,
  getQuizTitle,
  getQuizmUrl,
} from "./utils";
import { TitleScreen } from "./components/layout/TitleScreen";
import { QuizAbout } from "./components/page/QuizAbout";
import { fetchOpenAIApi } from "./utils/llms/chatGPT";
import { getFormattedSystemPrompt } from "./utils/llms/prompt";
import { useTranslations } from "./hooks/translations";

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
  const [cdnAvailableQuizes, setCdnAvailableQuizes] = createSignal<CdnQuizInfo[]>([]);
  const [quizes, setQuizes] = createSignal<QuizInfo[]>([]);
  const [quizStarted, setQuizStarted] = createSignal(false);
  const [selectedQuiz, setSelectedQuiz] = createSignal<QuizInfo>();
  const [generateQuiz, setGenerateQuiz] = createSignal(false);
  const [aboutQuiz, setAboutQuiz] = createSignal(false);
  const [showLoadQuiz, setShowLoadQuiz] = createSignal(false);
  const [showSaveQuiz, setShowSaveQuiz] = createSignal(false);
  const [showSettingsQuiz, setShowSettingsQuiz] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [isApp, setIsApp] = createSignal(false);
  const [language, setLanguage] = createSignal("");
  const { getTranslation } = useTranslations();

  const systemLanguagePrompt = createMemo(() => {
    return getFormattedSystemPrompt(systemPrompt, language());
  });

  const showStart = createMemo(
    () =>
      !quizStarted() &&
      !generateQuiz() &&
      !loading() &&
      !showLoadQuiz() &&
      !showSaveQuiz() &&
      !aboutQuiz() &&
      !showSettingsQuiz()
  );

  onMount(async () => {
    const quizLanguage = getStringValue("language");
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
      setShowLoadQuiz(false);
      setLoading(true);
      const customQuizTitle = getQuizTitle();
      getCustomQuiz(customQuizUrl, customQuizTitle || "custom").then((data) => {
        setSelectedQuiz(data);
        setLoading(false);
      });
    }
  });

  createEffect(async () => {
    if (!isApp()) return;
    const unlisten = await listen("quizes", (event: any) => {
      const responseQuizes = parseResponseJson(event.payload);

      setQuizes(responseQuizes);
      setLoading(false);
    });

    return () => unlisten();
  });

  const handleGenerateQuiz = async (formData: QuizFormData, options: QuizFormOptions) => {
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

  return (
    <Container>
      <Header />
      <Show when={showStart()}>
        <MenuContainer>
          {selectedQuiz() && (
            <TitleScreen
              title={selectedQuiz()?.name || ""}
              difficulty={selectedQuiz()?.difficulty || ""}
            />
          )}
          <Menu>
            <MenuButton
              onClick={() => setQuizStarted(true)}
              variant="contained"
              color="primary"
              disabled={isEmpty(selectedQuiz())}
            >
              {getTranslation("start_quiz")}
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
      <Show when={quizStarted() && !isEmpty(selectedQuiz())}>
        <QuizComponent
          quiz={selectedQuiz()?.data as Topics[]}
          onSubmit={() => setQuizStarted(false)}
          onCancel={() => setQuizStarted(false)}
        />
      </Show>
      <Show when={showLoadQuiz()}>
        <QuizLoad
          cdnQuizes={cdnAvailableQuizes()}
          isApp={isApp()}
          quizes={quizes()}
          onBack={() => setShowLoadQuiz(false)}
          onLoad={(quiz) => {
            setSelectedQuiz(quiz);
            setShowLoadQuiz(false);
          }}
          onFetchCDNLoad={(path, name) => {
            setShowLoadQuiz(false);
            setLoading(true);
            getCdnQuiz(path, name).then((data) => {
              setSelectedQuiz(data);
              setLoading(false);
            });
          }}
          onFetchLoad={(url, name) => {
            setShowLoadQuiz(false);
            setLoading(true);
            getCustomQuiz(url, name).then((data) => {
              setSelectedQuiz(data);
              setLoading(false);
            });
          }}
        />
      </Show>
      <Show when={showSaveQuiz()}>
        <QuizSave isApp={isApp()} onBack={() => setShowSaveQuiz(false)} />
      </Show>
      <Show when={showSettingsQuiz()}>
        <QuizSettings onBack={() => setShowSettingsQuiz(false)} />
      </Show>
      <Show when={generateQuiz()}>
        <QuizForm
          isApp={isApp()}
          onGenerate={handleGenerateQuiz}
          onBack={() => setGenerateQuiz(false)}
        />
      </Show>
      <Show when={aboutQuiz()}>
        <QuizAbout systemPrompt={systemLanguagePrompt()} onBack={() => setAboutQuiz(false)} />
      </Show>
      <Footer />
    </Container>
  );
};
