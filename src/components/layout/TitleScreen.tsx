import { Typography } from "@suid/material";
import { Component } from "solid-js";
import { styled } from "solid-styled-components";

const TitleScreenContainer = styled(Typography)`
  background-color: ${(props) => props?.theme?.colors.background};
  font-weight: bold;
  margin-bottom: 20px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
`;

const TitleText = styled(Typography)`
  color: ${(props) => props?.theme?.colors.text};
  font-weight: bold;
  margin-bottom: 20px;
`;

const DifficultyText = styled(Typography)`
  color: ${(props) => props?.theme?.colors.text};
`;

interface TitleScreenProps {
  title: string;
  difficulty: string;
}

export const TitleScreen: Component<TitleScreenProps> = ({ title, difficulty }) => {
  return (
    <TitleScreenContainer>
      <TitleText variant="h3">{title}</TitleText>
      <DifficultyText variant="subtitle1">{difficulty}</DifficultyText>
    </TitleScreenContainer>
  );
};
