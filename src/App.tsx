import { createEffect } from "solid-js";
import { styled } from "solid-styled-components";
import { Header } from "./components/layout/Header";
import { GenerateQuiz } from "./components/page/GenerateQuiz";
import { Footer } from "./components/layout/Footer";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const App = () => {
  createEffect(async () => {
    console.log("createEffect");
  });

  return (
    <Container>
      <Header />
      <GenerateQuiz />
      <Footer />
    </Container>
  );
};
