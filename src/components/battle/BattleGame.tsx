import { createSignal, onMount, Show, Component, createMemo } from "solid-js";
import { styled } from "solid-styled-components";
import { Button, CircularProgress } from "@suid/material";
import { QuizInfo } from "../../types";
import { TitleScreen } from "../layout/TitleScreen";
import { useTranslations } from "../../hooks/translations";
import { Back } from "../icons/Back";
import { BattleSettings } from "./BattleSettings";
import { getAllQuestions } from "./question";
import { generateTopics } from "./utils";
import { Question, Topic } from "./types";
import { BattleComponent } from "./BattleComponent";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
`;

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
  const [quizStarted, setQuizStarted] = createSignal(false);
  const [showSettingsQuiz, setShowSettingsQuiz] = createSignal(false);
  const [topics, setTopics] = createSignal<Topic[]>([]);
  const [questions, setQuestions] = createSignal<Question[]>([]);
  const [mounted, setMounted] = createSignal(false);
  const { getTranslation } = useTranslations();

  const showStart = createMemo(() => !quizStarted() && !showSettingsQuiz());

  onMount(() => {
    getAllQuestions(quiz.data).then((allQuestions) => {
      const generatedTopics = generateTopics(allQuestions);
      setQuestions(allQuestions);
      setTopics(generatedTopics);
      setMounted(true);
    });
  });

  return (
    <Show
      when={mounted()}
      fallback={
        <LoaderContainer>
          <CircularProgress />
        </LoaderContainer>
      }
    >
      <Container>
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
          <BattleComponent topics={topics()} questions={questions()} />
        </Show>
        <Show when={showSettingsQuiz()}>
          <BattleSettings onBack={() => setShowSettingsQuiz(false)} />
        </Show>
      </Container>
    </Show>
  );
};
