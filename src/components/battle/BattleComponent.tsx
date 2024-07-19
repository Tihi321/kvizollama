import { createSignal, For, Component, onMount, createEffect } from "solid-js";
import { Button, Modal } from "@suid/material";
import { RenderFlag, RenderSoldier } from "./PlayerPieces";
import { RulesModalContent } from "./ModalPieces";
import { GameBoard, Square } from "./GridPieces";
import { checkWinCondition, createInitialBoard, moveSoldier } from "./logic";
import { Cell, Question, Topic } from "./types";
import { Back } from "../icons/Back";
import { generateTopics } from "./utils";
import {
  ColorSquare,
  Container,
  Content,
  GameMenu,
  Legend,
  LegendItem,
  MenuButton,
  Player,
  Players,
  Sidebar,
} from "./GamePieces";
import { BattleQuestion } from "./BattleQuestion";
import { getStringValue } from "../../hooks/local";

interface BattleComponentProps {
  questions: Question[];
  onBack: () => void;
  numberOfPlayers: number;
}

export const BattleComponent: Component<BattleComponentProps> = (props) => {
  const [board, setBoard] = createSignal<Cell[][]>([]);
  const [currentPlayer, setCurrentPlayer] = createSignal(1);
  const [selectedSquare, setSelectedSquare] = createSignal<{ row: number; col: number } | null>(
    null
  );
  const [targetSquare, setTargetSquare] = createSignal<{ row: number; col: number } | null>(null);
  const [currentQuestion, setCurrentQuestion] = createSignal<Question | null>(null);
  const [correctAnswers, setCorrectAnswers] = createSignal(0);
  const [questionModalOpen, setQuestionModalOpen] = createSignal(false);
  const [rulesModalOpen, setRulesModalOpen] = createSignal(false);
  const [showExplanation, setShowExplanation] = createSignal(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = createSignal<boolean | null>(null);
  const [activePlayers, setActivePlayers] = createSignal<number[]>([1, 2]);
  const [topics, setTopics] = createSignal<Topic[]>([]);
  const [isAttackingFlag, setIsAttackingFlag] = createSignal(false);
  const [, setColorUpdate] = createSignal(0);

  const initializeBoard = () => {
    const newTopics = generateTopics(props.questions);
    setTopics(newTopics);
    const newBoard = createInitialBoard(newTopics, props.numberOfPlayers);
    setBoard(newBoard);
    setCurrentPlayer(1);
    setSelectedSquare(null);
    setTargetSquare(null);
    setCurrentQuestion(null);
    setQuestionModalOpen(false);
    setShowExplanation(false);
    setLastAnswerCorrect(null);
    setActivePlayers(Array.from({ length: props.numberOfPlayers }, (_, i) => i + 1));
  };

  const selectSquare = (row: number, col: number) => {
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
    }
  };

  const openQuestion = () => {
    const topic = board()[targetSquare()!.row][targetSquare()!.col].topic.name;
    const topicQuestions = props.questions.filter((q) => q.topic === topic);
    const question = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
    setCurrentQuestion(question);
    setQuestionModalOpen(true);
    setShowExplanation(false);
    setLastAnswerCorrect(null);
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
          setQuestionModalOpen(false);
          if (checkWinCondition(newBoard, currentPlayer(), activePlayers())) {
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
        setQuestionModalOpen(false);
      }, 3000);
    }
  };

  const nextPlayer = () => {
    const currentIndex = activePlayers().indexOf(currentPlayer());
    const nextIndex = (currentIndex + 1) % activePlayers().length;
    setCurrentPlayer(activePlayers()[nextIndex]);
  };

  createEffect(() => {
    const colorChangeListener = () => {
      setColorUpdate((prev) => prev + 1);
    };
    window.addEventListener("storage", colorChangeListener);
    return () => {
      window.removeEventListener("storage", colorChangeListener);
    };
  });

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
                  <Square backgroundColor={cell.topic.color} onClick={() => selectSquare(i(), j())}>
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
          <GameMenu>
            <MenuButton onClick={initializeBoard}>New Game</MenuButton>
            <MenuButton onClick={() => setRulesModalOpen(true)}>i</MenuButton>
            <Button variant="contained" color="info" onClick={props.onBack} size="small">
              <Back />
            </Button>
          </GameMenu>
        </Sidebar>
      </Content>
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
      <Modal
        open={questionModalOpen()}
        onClose={() => {
          nextPlayer();
          setQuestionModalOpen(false);
        }}
      >
        <BattleQuestion
          onClose={() => {
            nextPlayer();
            setQuestionModalOpen(false);
          }}
          topic={currentQuestion()?.topic}
          difficulty={currentQuestion()?.difficulty}
          title={currentQuestion()?.question}
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

      <Modal open={rulesModalOpen()} onClose={() => setRulesModalOpen(false)}>
        <RulesModalContent
          onClose={() => setRulesModalOpen(false)}
          numberOfPlayers={props.numberOfPlayers}
        />
      </Modal>
    </Container>
  );
};
