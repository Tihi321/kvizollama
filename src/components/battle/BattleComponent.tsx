import { createSignal, For, Component, onMount, Show } from "solid-js";
import { Button, Modal } from "@suid/material";
import { RenderFlag, RenderSoldier } from "./PlayerPieces";
import {
  CentralModalContent,
  ColorSquare,
  Legend,
  LegendItem,
  Legends,
  RulesModalContent,
} from "./ModalPieces";
import { GameBoard, Square } from "./GridPieces";
import { checkWinCondition, createInitialBoard, moveSoldier } from "./logic";
import { Cell, Question, Topic } from "./types";
import { Back } from "../icons/Back";
import { generateTopics } from "./utils";
import {
  Container,
  Content,
  GameMenu,
  MenuButton,
  Player,
  Players,
  Sidebar,
  TopicContainer,
} from "./GamePieces";
import { BattleQuestion } from "./BattleQuestion";
import { getStringValue } from "../../hooks/local";

interface BattleComponentProps {
  questions: Question[];
  onBack: () => void;
}

export const BattleComponent: Component<BattleComponentProps> = (props) => {
  const [board, setBoard] = createSignal<Cell[][]>([]);
  const [currentPlayer, setCurrentPlayer] = createSignal(1);
  const [selectedSquare, setSelectedSquare] = createSignal<{ row: number; col: number } | null>(
    null
  );
  const [boardSize, setBoardSize] = createSignal(0);
  const [targetSquare, setTargetSquare] = createSignal<{ row: number; col: number } | null>(null);
  const [currentQuestion, setCurrentQuestion] = createSignal<Question | null>(null);
  const [correctAnswers, setCorrectAnswers] = createSignal(0);
  const [modalView, setModalView] = createSignal<"question" | "legend" | "rules" | null>(null);
  const [clickedTopic, setClickedTopic] = createSignal<Topic>();
  const [showExplanation, setShowExplanation] = createSignal(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = createSignal<boolean | null>(null);
  const [activePlayers, setActivePlayers] = createSignal<number[]>([1, 2]);
  const [topics, setTopics] = createSignal<Topic[]>([]);
  const [isAttackingFlag, setIsAttackingFlag] = createSignal(false);
  const [answeredQuestions, setAnsweredQuestions] = createSignal<Record<string, string[]>>({});

  const openModal = (view: "question" | "legend" | "rules") => {
    setModalView(view);
  };

  const closeModal = () => {
    setModalView(null);
  };

  const initializeBoard = () => {
    const storedNumberOfPlayers = Number(getStringValue(`kvizolamma/numberofplayers`)) || 2;
    const storedBoardSize = Number(getStringValue(`kvizolamma/boardsize`)) || 8;
    setBoardSize(storedBoardSize);
    const newTopics = generateTopics(props.questions);
    setTopics(newTopics);
    const newBoard = createInitialBoard(newTopics, storedNumberOfPlayers, storedBoardSize);
    setBoard(newBoard);
    setCurrentPlayer(1);
    setSelectedSquare(null);
    setTargetSquare(null);
    setCurrentQuestion(null);
    closeModal();
    setClickedTopic(undefined);
    setShowExplanation(false);
    setLastAnswerCorrect(null);
    setActivePlayers(Array.from({ length: storedNumberOfPlayers }, (_, i) => i + 1));
    setAnsweredQuestions({});
  };

  const selectSquare = (row: number, col: number, topic: Topic) => {
    if (board()[row][col].soldier?.player === currentPlayer()) {
      setSelectedSquare({ row, col });
    } else if (selectedSquare()) {
      const dx = Math.abs(row - selectedSquare()!.row);
      const dy = Math.abs(col - selectedSquare()!.col);
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        setTargetSquare({ row, col });
        setCorrectAnswers(0);
        setIsAttackingFlag(board()[row][col].flag !== null);
        openQuestion();
      }
    } else {
      setClickedTopic(topic);
    }
  };

  const openQuestion = () => {
    const topic = board()[targetSquare()!.row][targetSquare()!.col].topic.name;
    const topicQuestions = props.questions.filter((q) => q.topic === topic);
    const answeredTopicQuestions = answeredQuestions()[topic] || [];

    let availableQuestions = topicQuestions.filter(
      (q) => !answeredTopicQuestions.includes(q.question)
    );

    if (availableQuestions.length === 0) {
      // If all questions have been answered, reset the answered questions for this topic
      setAnsweredQuestions((prev) => ({ ...prev, [topic]: [] }));
      availableQuestions = topicQuestions;
    }

    const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setCurrentQuestion(question);
    openModal("question");
    setShowExplanation(false);
    setLastAnswerCorrect(null);

    // Mark the question as answered
    setAnsweredQuestions((prev) => ({
      ...prev,
      [topic]: [...(prev[topic] || []), question.question],
    }));
  };

  const checkAnswer = (answerIndex: number) => {
    const question = currentQuestion();
    if (!question) return;

    const selectedAnswer = question.answers[answerIndex];
    const isCorrect = selectedAnswer.correct;

    setLastAnswerCorrect(isCorrect);
    setShowExplanation(true);

    if (isCorrect) {
      setCorrectAnswers((count) => count + 1);
      const requiredCorrectAnswers = isAttackingFlag() ? 2 : 1;

      if (correctAnswers() === requiredCorrectAnswers) {
        setTimeout(() => {
          const newBoard = moveSoldier(board(), selectedSquare()!, targetSquare()!);
          setBoard(newBoard);
          closeModal();
          if (checkWinCondition(newBoard, currentPlayer(), activePlayers(), boardSize())) {
            alert(`Player ${currentPlayer()} wins!`);
            initializeBoard();
          } else {
            nextPlayer();
          }
          setSelectedSquare(null);
          setTargetSquare(null);
        }, 3000);
      } else {
        setTimeout(openQuestion, 3000);
      }
    } else {
      setLastAnswerCorrect(false);
      setShowExplanation(true);
      setTimeout(() => {
        nextPlayer();
        closeModal();
      }, 3000);
    }
  };

  const nextPlayer = () => {
    const currentIndex = activePlayers().indexOf(currentPlayer());
    const nextIndex = (currentIndex + 1) % activePlayers().length;
    setCurrentPlayer(activePlayers()[nextIndex]);
  };

  onMount(() => {
    initializeBoard();
  });

  return (
    <Container>
      <Content>
        <GameBoard>
          <For each={board()}>
            {(row, i) => (
              <For each={row}>
                {(cell, j) => (
                  <Square
                    backgroundColor={cell.topic.color}
                    onClick={() => selectSquare(i(), j(), cell.topic)}
                  >
                    {cell.soldier && <RenderSoldier player={cell.soldier.player} />}
                    {cell.flag && <RenderFlag player={cell.flag.player} />}
                  </Square>
                )}
              </For>
            )}
          </For>
        </GameBoard>
        <Sidebar>
          <Players>
            <For each={activePlayers()}>
              {(player) => (
                <Player
                  active={currentPlayer() === player}
                  player={player}
                  backgroundColor={getStringValue(`kvizolamma/player${player}Color`)}
                >
                  <div>Player {player}: </div>
                  <div>
                    {
                      board()
                        .flat()
                        .filter((cell) => cell.soldier?.player === player).length
                    }{" "}
                    soldiers
                  </div>
                </Player>
              )}
            </For>
          </Players>
          <Show when={clickedTopic()}>
            <TopicContainer backgroundColor={clickedTopic()?.color}>
              {clickedTopic()?.name}
            </TopicContainer>
          </Show>
          <GameMenu>
            <MenuButton onClick={initializeBoard}>New Game</MenuButton>
            <MenuButton onClick={() => openModal("rules")}>i</MenuButton>
            <MenuButton onClick={() => openModal("legend")}>Legend</MenuButton>
            <Button variant="contained" color="info" onClick={props.onBack} size="small">
              <Back />
            </Button>
          </GameMenu>
        </Sidebar>
      </Content>
      <Modal
        open={modalView() === "question"}
        onClose={() => {
          nextPlayer();
          closeModal();
        }}
      >
        <BattleQuestion
          onClose={() => {
            nextPlayer();
            closeModal();
          }}
          topic={currentQuestion()?.topic}
          difficulty={currentQuestion()?.difficulty}
          question={currentQuestion()?.question}
          explanation={currentQuestion()?.explanation}
          answers={currentQuestion()?.answers}
          correct={lastAnswerCorrect()}
          showExplanation={showExplanation()}
          onAnswerSelect={checkAnswer}
          isAttackingFlag={isAttackingFlag()}
          correctAnswers={correctAnswers()}
        />
      </Modal>

      <Modal open={modalView() === "rules"} onClose={closeModal}>
        <RulesModalContent onClose={closeModal} />
      </Modal>

      <Modal open={modalView() === "legend"} onClose={closeModal}>
        <CentralModalContent onClose={closeModal}>
          <Legends>
            <h2>Legend</h2>
            <Legend>
              <For each={topics()}>
                {(topic) => (
                  <LegendItem>
                    <ColorSquare backgroundColor={topic.color} />
                    <span>{topic.name}</span>
                  </LegendItem>
                )}
              </For>
            </Legend>
          </Legends>
        </CentralModalContent>
      </Modal>
    </Container>
  );
};
