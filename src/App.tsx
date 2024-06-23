import { createEffect, createSignal } from "solid-js";
import { styled } from "solid-styled-components";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { emit, listen } from "@tauri-apps/api/event";
import { cleanString, parseResponseJson } from "./utils/response";
import { QuizFormData, Topic } from "./types";
import { Quiz } from "./components/page/Quiz";
import { QuizForm } from "./components/page/QuizForm";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const quizData = JSON.parse(
  '[{"topic":"Mathematics","difficulty":"Easy","questions":[{"question":"What is 2 + 2?","answers":[{"answer":"4","correct":true,"points":10},{"answer":"22","correct":false,"points":5},{"answer":"3","correct":false,"points":3},{"answer":"5","correct":false,"points":1}],"hint":"It\'s the first even number.","explanation":"2 + 2 equals 4."}]},{"topic":"Literature","difficulty":"Hard","questions":[{"question":"Who wrote \'To Kill a Mockingbird\'?","answers":[{"answer":"Harper Lee","correct":true,"points":10},{"answer":"Mark Twain","correct":false,"points":5},{"answer":"Ernest Hemingway","correct":false,"points":3},{"answer":"John Steinbeck","correct":false,"points":1}],"hint":"The author is not a man.","explanation":"\'To Kill a Mockingbird\' was written by Harper Lee."}]}]'
);

export const App = () => {
  const [topics, setTopics] = createSignal<Topic[]>([]);
  const [quizStarted, setQuizStarted] = createSignal(false);

  createEffect(async () => {
    const unlisten = await listen("generate_quiz_question_response", (event: any) => {
      console.log("generate_quiz_question_response:", event.payload);

      const cleanedResponse = cleanString(event.payload);
      const responseQuestions = parseResponseJson(cleanedResponse);
      console.log(responseQuestions);

      setTopics(responseQuestions);
      setQuizStarted(true);
    });

    return () => unlisten();
  });

  const handleStart = async (formData: QuizFormData) => {
    console.log("Quiz Form Data:", formData);
    // emit("generate_quiz_question", formData);
    setTopics(quizData);
    setQuizStarted(true);
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setTopics([]);
  };
  return (
    <Container>
      <Header />
      {!quizStarted() ? (
        <QuizForm onSubmit={handleStart} />
      ) : (
        <Quiz topics={topics()} onRestart={handleRestart} />
      )}
      <Footer />
    </Container>
  );
};
