import { createEffect } from "solid-js";
import { styled } from "solid-styled-components";

const Container = styled("div")`
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const App = () => {
  createEffect(async () => {
    console.log("createEffect");
  });

  return <Container>app</Container>;
};
