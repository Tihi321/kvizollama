import { styled } from "solid-styled-components";
import { Typography, IconButton, SvgIcon } from "@suid/material";
import { createEffect } from "solid-js";

const StyledAppBar = styled("div")`
  position: relative;
  background-color: ${(props) => props?.theme?.colors.background};
  color: ${(props) => props?.theme?.colors.text};
  text-align: center;
  padding: 8px;
  cursor: pointer;
`;

const IconButtonStyled = styled(IconButton)`
  position: absolute !important;
  top: 20px;
  right: 20px;

  svg {
    fill: ${(props) => props?.theme?.colors.text};
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
      <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
        Ollama Quiz
      </Typography>
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
        <SvgIcon>
          <path d="M11 5L6 9H2v6h4l5 4V5zm8.07-.07a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </SvgIcon>
      </IconButtonStyled>
      <audio ref={audioElement}>
        <source src="https://start.tihomir-selak.from.hr/audio/just-relax.mp3" type="audio/mpeg" />
      </audio>
    </StyledAppBar>
  );
};
