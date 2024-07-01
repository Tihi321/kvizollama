import { Component } from "solid-js";
import { styled } from "solid-styled-components";
import { useTranslations } from "../../hooks/translations";

const TitleScreenContainer = styled("div")`
  background-color: ${(props) => props?.theme?.colors.darkBackground};
  font-weight: bold;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
  margin: 40px;

  @media (min-width: 700px) {
    padding: 80px;
    margin: 60px;
  }
`;

const TitleText = styled("h3")`
  color: ${(props) => props?.theme?.colors.text};
  font-weight: bold;
  font-size: 32px;
  line-height: 1.2;
  margin: 0;
  margin-bottom: 20px;

  @media (min-width: 700px) {
    margin-bottom: 10px;
    font-size: 48px;
  }
`;

const DifficultyText = styled("div")`
  color: ${(props) => props?.theme?.colors.text};
  font-size: 14px;

  @media (min-width: 700px) {
    font-size: 18px;
  }
`;

interface TitleScreenProps {
  title: string;
  difficulty: string;
}

export const TitleScreen: Component<TitleScreenProps> = ({ title, difficulty }) => {
  const { getTranslation } = useTranslations();

  const getDifficulty = () => {
    switch (difficulty) {
      case "easy":
      case "Easy":
        return getTranslation("easy");
      case "normal":
      case "Normal":
        return getTranslation("medium");
      case "hard":
      case "Hard":
        return getTranslation("hard");
      default:
        return "";
    }
  };
  return (
    <TitleScreenContainer>
      <TitleText>{title}</TitleText>
      <DifficultyText>{getDifficulty()}</DifficultyText>
    </TitleScreenContainer>
  );
};
