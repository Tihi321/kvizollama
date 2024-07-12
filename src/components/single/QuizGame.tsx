// @ts-ignore
import systemPrompt from "../assets/system_prompt.txt?raw";

import { createSignal, Show, createMemo, Component } from "solid-js";
import { styled } from "solid-styled-components";
import { Button } from "@suid/material";
import { QuizSettings } from "./QuizSettings";
import { QuizInfo, Topics } from "../../types";
import { useTranslations } from "../../hooks/translations";
import { TitleScreen } from "../layout/TitleScreen";
import { QuizComponent } from "./QuizComponent";
import { Back } from "../icons/Back";

const MenuContainer = styled("div")`
  display: flex;
  flex: 1;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Menu = styled("div")`
  display: flex;
  flex: 1;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
`;

const MenuButton = styled(Button)`
  width: 300px;
`;

interface QuizGameProps {
  quiz: QuizInfo;
  onBack: () => void;
}

export const QuizGame: Component<QuizGameProps> = ({ quiz, onBack }) => {
  const [quizStarted, setQuizStarted] = createSignal(false);
  const [showSettingsQuiz, setShowSettingsQuiz] = createSignal(false);
  const { getTranslation } = useTranslations();

  const showStart = createMemo(() => !quizStarted() && !showSettingsQuiz());

  return (
    <>
      <Show when={showStart()}>
        <MenuContainer>
          <TitleScreen title={quiz.name} difficulty={quiz.difficulty} />
          <Menu>
            <MenuButton onClick={() => setQuizStarted(true)} variant="contained" color="primary">
              {getTranslation("start_quiz")}
            </MenuButton>
            <MenuButton
              onClick={() => setShowSettingsQuiz(true)}
              variant="contained"
              color="primary"
            >
              {getTranslation("settings")}
            </MenuButton>
            <MenuButton variant="contained" color="info" onClick={onBack}>
              <Back />
            </MenuButton>
          </Menu>
        </MenuContainer>
      </Show>
      <Show when={quizStarted()}>
        <QuizComponent
          quiz={quiz.data as Topics[]}
          onSubmit={() => setQuizStarted(false)}
          onCancel={() => setQuizStarted(false)}
        />
      </Show>
      <Show when={showSettingsQuiz()}>
        <QuizSettings onBack={() => setShowSettingsQuiz(false)} />
      </Show>
    </>
  );
};
