import { styled } from "solid-styled-components";
import { IconButton } from "@suid/material";
import { createEffect } from "solid-js";
import { Speaker } from "../icons/Speaker";

const StyledAppBar = styled("div")`
  position: relative;
  background-color: ${(props) => props?.theme?.colors.background};
  color: ${(props) => props?.theme?.colors.text};
  text-align: center;
  padding: 16px;
  cursor: pointer;
`;

const IconButtonStyled = styled(IconButton)`
  position: absolute !important;
  top: 15px;
  right: 15px;

  svg {
    fill: ${(props) => props?.theme?.colors.text};
  }
`;

const TitleText = styled("h3")`
  color: ${(props) => props?.theme?.colors.text};
  font-size: 24px;
  line-height: 1;
  margin: 0;

  @media (min-width: 700px) {
    margin-bottom: 10px;
    font-size: 32px;
  }
`;

export const Header = () => {
  let audioElement: any;

  createEffect(() => {
    if (audioElement) {
      audioElement.volume = 0.01;
      audioElement.loop = true;
    }
  });

  return (
    <StyledAppBar>
      <TitleText>Ollama Quiz</TitleText>
      <IconButtonStyled
        aria-label="toggle volume"
        onClick={() => {
          if (audioElement.paused) {
            audioElement.play();
          } else {
            audioElement.pause();
          }
        }}
      >
        <Speaker />
      </IconButtonStyled>
      <audio ref={audioElement}>
        <source src="https://start.tihomir-selak.from.hr/audio/just-relax.mp3" type="audio/mpeg" />
      </audio>
    </StyledAppBar>
  );
};
