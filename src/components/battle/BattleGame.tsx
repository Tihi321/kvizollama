import { createSignal, onMount, Show, Component } from "solid-js";
import { styled } from "solid-styled-components";
import { Button, CircularProgress } from "@suid/material";
import { QuizInfo } from "../../types";
import { TitleScreen } from "../layout/TitleScreen";
import { useTranslations } from "../../hooks/translations";
import { Back } from "../icons/Back";
import { BattleSettings } from "./BattleSettings";
import { getAllQuestions } from "./question";
import { Question } from "./types";
import { BattleComponent } from "./BattleComponent";

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

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

interface BattleGameProps {
  quiz: QuizInfo;
  onBack: () => void;
}

export const BattleGame: Component<BattleGameProps> = ({ quiz, onBack }) => {
  const [view, setView] = createSignal<"start" | "battle" | "settings">("start");
  const [questions, setQuestions] = createSignal<Question[]>([]);
  const [numberOfPlayers, setNumberOfPlayers] = createSignal(2);
  const [mounted, setMounted] = createSignal(false);
  const { getTranslation } = useTranslations();

  onMount(() => {
    getAllQuestions(quiz.data).then((allQuestions) => {
      setQuestions(allQuestions);
      setMounted(true);
    });
  });

  const handleSettingsChange = (settings: { numberOfPlayers: number }) => {
    setNumberOfPlayers(settings.numberOfPlayers);
  };

  return (
    <Show
      when={mounted()}
      fallback={
        <LoaderContainer>
          <CircularProgress />
        </LoaderContainer>
      }
    >
      <Show when={view() === "start"}>
        <MenuContainer>
          <TitleScreen title={quiz.name} difficulty={quiz.difficulty} />
          <Menu>
            <MenuButton onClick={() => setView("battle")} variant="contained" color="primary">
              {getTranslation("start_quiz")}
            </MenuButton>
            <MenuButton onClick={() => setView("settings")} variant="contained" color="primary">
              {getTranslation("settings")}
            </MenuButton>
            <MenuButton variant="contained" color="info" onClick={onBack}>
              <Back />
            </MenuButton>
          </Menu>
        </MenuContainer>
      </Show>
      {view() === "battle" && (
        <BattleComponent
          questions={questions()}
          onBack={() => setView("start")}
          numberOfPlayers={numberOfPlayers() as number}
        />
      )}
      {view() === "settings" && (
        <BattleSettings
          onBack={() => setView("start")}
          onSettingsChange={handleSettingsChange}
          initialNumberOfPlayers={numberOfPlayers()}
        />
      )}
    </Show>
  );
};
