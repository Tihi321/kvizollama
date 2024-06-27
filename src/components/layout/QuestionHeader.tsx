import { Component } from "solid-js";
import { styled } from "solid-styled-components";
import { Typography, IconButton } from "@suid/material";
import { Echo } from "../icons/Echo";

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
        <Echo />
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
