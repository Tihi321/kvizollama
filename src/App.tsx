import { createEffect, createSignal, Show, createMemo } from "solid-js";
import { styled } from "solid-styled-components";
import { CircularProgress, Box, Button } from "@suid/material";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { emit, listen } from "@tauri-apps/api/event";
import { cleanString, parseResponseJson } from "./utils/response";
import { QuizFormData, Topic } from "./types";
import { Quiz } from "./components/page/Quiz";
import { QuizForm } from "./components/page/QuizForm";
import { isEmpty } from "lodash";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const App = () => {
  const [topics, setTopics] = createSignal<Topic[]>([]);
  const [quizStarted, setQuizStarted] = createSignal(false);
  const [generateQuiz, setGenerateQuiz] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  const showStart = createMemo(() => !quizStarted() && !generateQuiz() && !loading());

  createEffect(async () => {
    const unlisten = await listen("generate_quiz_question_response", (event: any) => {
      console.log("generate_quiz_question_response:", event.payload);

      const cleanedResponse = cleanString(event.payload);
      const responseQuestions = parseResponseJson(cleanedResponse);
      console.log(responseQuestions);

      setTopics(responseQuestions);
      setLoading(false);
    });

    return () => unlisten();
  });

  const handleGenerateQuiz = async (formData: QuizFormData) => {
    emit("generate_quiz_question", formData);
    setGenerateQuiz(false);
    setLoading(true);
  };

  return (
    <Container>
      <Header />
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
          <Button
            onClick={() => setQuizStarted(true)}
            variant="contained"
            color="primary"
            disabled={isEmpty(topics())}
          >
            Start
          </Button>
          <Button onClick={() => setGenerateQuiz(true)} variant="contained" color="primary">
            Generate
          </Button>
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
      <Show when={quizStarted() && !isEmpty(topics())}>
        <Quiz topics={topics()} onSubmit={() => setQuizStarted(false)} />
      </Show>
      <Show when={generateQuiz()}>
        <QuizForm onSubmit={handleGenerateQuiz} onBack={() => setGenerateQuiz(false)} />
      </Show>
      <Footer />
    </Container>
  );
};
