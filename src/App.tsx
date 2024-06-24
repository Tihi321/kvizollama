import { createEffect, createSignal, Show, createMemo, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import { CircularProgress, Box, Button } from "@suid/material";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { emit, listen } from "@tauri-apps/api/event";
import { parseResponseJson } from "./utils/response";
import { QuizFormData, Topics, QuizInfo } from "./types";
import { QuizComponent } from "./components/page/QuizComponent";
import { QuizForm } from "./components/page/QuizForm";
import { isEmpty, map } from "lodash";
import { isTauri } from "./utils/enviroment";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const App = () => {
  const [quizes, setQuizes] = createSignal<QuizInfo[]>([]);
  const [quizStarted, setQuizStarted] = createSignal(false);
  const [selectedQuizName, setSelectedQuizName] = createSignal<string>("");
  const [generateQuiz, setGenerateQuiz] = createSignal(false);
  const [showLoadQuiz, setShowLoadQuiz] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [isApp, setIsApp] = createSignal(false);

  const showStart = createMemo(
    () => !quizStarted() && !generateQuiz() && !loading() && !showLoadQuiz()
  );

  const selectedQuiz = createMemo(() => quizes().find((quiz) => quiz.name === selectedQuizName()));

  onMount(async () => {
    const isApp = await isTauri();
    setIsApp(isApp);
    if (isApp) {
      emit("get_quizes");
    } else {
      setLoading(false);
    }
  });

  createEffect(async () => {
    const unlisten = await listen("quizes", (event: any) => {
      console.log("generate_quiz_question_response:", event.payload);

      const responseQuizes = parseResponseJson(event.payload);

      setQuizes(responseQuizes);
      setLoading(false);
    });

    return () => unlisten();
  });

  const handleRemoveQuiz = async (name: string) => {
    emit("remove_quiz", name);
    setLoading(true);
  };

  const handleGenerateQuiz = async (formData: QuizFormData) => {
    emit("generate_quiz", formData);
    setGenerateQuiz(false);
    setLoading(true);
  };

  return (
    <Container>
      <Header />
      <Show when={showLoadQuiz()}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {map(quizes(), (values: QuizInfo) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                gap: 2,
              }}
            >
              {values.name}
              <Button
                onClick={() => {
                  setSelectedQuizName(values.name);
                  setShowLoadQuiz(false);
                }}
                variant="contained"
                color="primary"
              >
                Load
              </Button>
              <Button
                onClick={() => {
                  handleRemoveQuiz(values.name);
                }}
                variant="contained"
                color="secondary"
              >
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      </Show>
      <Show when={showStart()}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
            flex: 1,
          }}
        >
          {selectedQuiz() && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {selectedQuiz()?.name} - {selectedQuiz()?.difficulty}
            </Box>
          )}
          <Button
            onClick={() => setQuizStarted(true)}
            variant="contained"
            color="primary"
            disabled={isEmpty(selectedQuiz())}
          >
            Start
          </Button>
          {isApp() && (
            <>
              <Button
                disabled={isEmpty(quizes())}
                onClick={() => setShowLoadQuiz(true)}
                variant="contained"
                color="primary"
              >
                Load
              </Button>
              <Button onClick={() => setGenerateQuiz(true)} variant="contained" color="primary">
                Generate
              </Button>
              <Button
                onClick={() => {
                  console.log("import");
                }}
                variant="contained"
                color="primary"
              >
                Import
              </Button>
            </>
          )}
        </Box>
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
        />
      </Show>
      <Show when={generateQuiz()}>
        <QuizForm onSubmit={handleGenerateQuiz} onBack={() => setGenerateQuiz(false)} />
      </Show>
      <Footer />
    </Container>
  );
};
