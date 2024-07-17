import { createSignal, For, Component, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import { Button, Modal, Typography } from "@suid/material";
import { Player, RenderFlag, RenderSoldier } from "./Pieces";
import {
  AnswerButton,
  DifficultyBadge,
  ExplanationText,
  ModalContent,
  ModalQuestion,
  ModalTitleContainer,
  RulesModalContent,
} from "./ModalPieces";
import { ColorSquare, GameBoard, Legend, LegendItem, Square } from "./GridPieces";
import { ButtonHeaderContainer, HeaderInfo, StyledHeaderButton } from "./HeaderPieces";
import { checkWinCondition, createInitialBoard, moveSoldier } from "./logic";
import { Cell, Question, Topic } from "./types";
import { Back } from "../icons/Back";
import { generateTopics } from "./utils";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
`;

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
  const [questionCount, setQuestionCount] = createSignal(0);
  const [questionModalOpen, setQuestionModalOpen] = createSignal(false);
  const [rulesModalOpen, setRulesModalOpen] = createSignal(false);
  const [showExplanation, setShowExplanation] = createSignal(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = createSignal<boolean | null>(null);
  const [activePlayers, setActivePlayers] = createSignal<number[]>([1, 2]);
  const [topics, setTopics] = createSignal<Topic[]>([]);

  const initializeBoard = () => {
    const newTopics = generateTopics(props.questions);
    const newBoard = createInitialBoard(newTopics, props.numberOfPlayers);
    setTopics(newTopics);
    setBoard(newBoard);
    setCurrentPlayer(1);
    setSelectedSquare(null);
    setTargetSquare(null);
    setCurrentQuestion(null);
    setQuestionCount(0);
    setQuestionModalOpen(false);
    setShowExplanation(false);
    setLastAnswerCorrect(null);
    setActivePlayers(Array.from({ length: props.numberOfPlayers }, (_, i) => i + 1));
  };

  const startNewGame = () => {
    initializeBoard();
  };

  const selectSquare = (row: number, col: number) => {
    if (board()[row][col].soldier?.player === currentPlayer()) {
      setSelectedSquare({ row, col });
    } else if (selectedSquare()) {
      const dx = Math.abs(row - selectedSquare()!.row);
      const dy = Math.abs(col - selectedSquare()!.col);
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        setTargetSquare({ row, col });
        setQuestionCount(0);
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
      setQuestionCount((count) => count + 1);
      if (questionCount() === 1 || !board()[targetSquare()!.row][targetSquare()!.col].soldier) {
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
      nextPlayer();
      setQuestionModalOpen(false);
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
      <HeaderInfo>
        <For each={activePlayers()}>
          {(player) => (
            <Player active={currentPlayer() === player} player={currentPlayer()}>
              Player {player}:{" "}
              {
                board()
                  .flat()
                  .filter((cell) => cell.soldier?.player === player).length
              }{" "}
              soldiers
            </Player>
          )}
        </For>
        <ButtonHeaderContainer>
          <StyledHeaderButton onClick={startNewGame}>New Game</StyledHeaderButton>
          <StyledHeaderButton onClick={() => setRulesModalOpen(true)}>i</StyledHeaderButton>
          <Button
            variant="contained"
            color="info"
            onClick={props.onBack}
            sx={{ marginTop: "20px" }}
          >
            <Back />
          </Button>
        </ButtonHeaderContainer>
      </HeaderInfo>

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
          setCurrentPlayer(currentPlayer() === 1 ? 2 : 1);
          setQuestionModalOpen(false);
        }}
      >
        <ModalContent>
          <ModalTitleContainer>
            <h2>{currentQuestion()?.topic}</h2>
            <DifficultyBadge difficulty={currentQuestion()?.difficulty || "medium"}>
              {currentQuestion()?.difficulty}
            </DifficultyBadge>
          </ModalTitleContainer>

          <ModalQuestion>{currentQuestion()?.question}</ModalQuestion>
          {!showExplanation() && (
            <For each={currentQuestion()?.answers}>
              {(answer, index) => (
                <AnswerButton onClick={() => checkAnswer(index())}>{answer.answer}</AnswerButton>
              )}
            </For>
          )}
          {showExplanation() && (
            <>
              <Typography variant="h6" color={lastAnswerCorrect() ? "success" : "error"}>
                {lastAnswerCorrect() ? "Correct!" : "Incorrect!"}
              </Typography>
              {lastAnswerCorrect() && (
                <ExplanationText>{currentQuestion()?.explanation}</ExplanationText>
              )}
            </>
          )}
        </ModalContent>
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
