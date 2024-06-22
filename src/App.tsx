import { createEffect, createSignal, createMemo } from "solid-js";
import { styled } from "solid-styled-components";
import { Header } from "./components/layout/Header";
import { GenerateQuiz } from "./components/page/GenerateQuiz";
import { Footer } from "./components/layout/Footer";
import { listen } from "@tauri-apps/api/event";
import { isEmpty } from "lodash";
import { cleanString, parseResponseJson } from "./utils/response";
import { Topic } from "./types";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const App = () => {
  const [questions, setQuestions] = createSignal([] as Topic[]);
  const [loading, setLoading] = createSignal(false);

  const showForm = createMemo(() => {
    return !loading() && isEmpty(questions());
  });

  createEffect(async () => {
    const unlisten = await listen("generate_quiz_question_response", (event: any) => {
      console.log("generate_quiz_question_response:", event.payload);

      const cleanedResponse = cleanString(event.payload);
      const responseQuestions = parseResponseJson(cleanedResponse);
      console.log(responseQuestions);

      setQuestions(responseQuestions);
    });

    return () => unlisten();
  });

  createEffect(async () => {
    console.log("questions:", questions());
  });

  const toggleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  return (
    <Container>
      <Header />
      {showForm() && <GenerateQuiz setLoading={toggleLoading} />}
      {loading() && <div>Loading...</div>}
      <Footer />
    </Container>
  );
};
