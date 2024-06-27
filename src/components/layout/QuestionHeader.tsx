import { Component } from "solid-js";
import { styled } from "solid-styled-components";
import { Typography, IconButton, SvgIcon } from "@suid/material";

const IconButtonStyled = styled(IconButton)`
  position: absolute;
  top: 20px;
  right: 20px;
  svg {
    width: 24px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-bottom: 16px;
`;

const TopicTitle = styled("h6")`
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 400;

  @media (min-width: 700px) {
    font-size: 24px;
  }
`;

const Title = styled("h4")`
  margin: 0;
  font-size: 22px;
  text-align: center;

  @media (min-width: 700px) {
    font-size: 32px;
  }
`;

const HintBox = styled("div")`
  background-color: ${(props) => props?.theme?.colors.hint};
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 4px;
`;

interface QuestionHeaderProps {
  topic: string;
  hint: string;
  difficulty: string;
  title: string;
  showHint: boolean;
  onSpeak: () => void;
}

export const QuestionHeader: Component<QuestionHeaderProps> = (props) => {
  return (
    <Header>
      <IconButtonStyled aria-label="toggle volume" onClick={props.onSpeak}>
        <SvgIcon viewBox="0 0 20 20">
          <path
            d="M7.5 4c.18 0 .34.1.43.25l.04.08 4 11a.5.5 0 01-.9.42l-.04-.08L9.7 12H5.3l-1.33 3.67a.5.5 0 01-.96-.25l.02-.1 4-11A.5.5 0 017.5 4zm0 1.96L5.67 11h3.66L7.5 5.96zm5.24-3.9l.39.22a9.5 9.5 0 014.84 7.36l.03.31a.5.5 0 01-1 .1l-.03-.32a8.5 8.5 0 00-4.33-6.58l-.38-.21a.5.5 0 01.48-.88zm-1.17 2.68a.5.5 0 01.6-.2l.09.03.12.08a6.5 6.5 0 013.02 4.23l.05.27.04.27a.5.5 0 01-.96.25l-.02-.09-.05-.26a5.5 5.5 0 00-2.37-3.67l-.22-.15-.13-.07a.5.5 0 01-.17-.69z"
            fill-rule="nonzero"
            data-astro-cid-gvpn4u4b=""
          ></path>
        </SvgIcon>
      </IconButtonStyled>

      <TopicTitle>
        {props.topic} ({props.difficulty})
      </TopicTitle>
      <Title>{props.title}</Title>
      {props.showHint && (
        <HintBox>
          <Typography>{props.hint}</Typography>
        </HintBox>
      )}
    </Header>
  );
};
