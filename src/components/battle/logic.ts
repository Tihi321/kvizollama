import { Cell, Topic } from "./types";

const placePieces = (board: Cell[][], player: number, boardSize: number): Cell[][] => {
  const newBoard = board.map((row) => [...row]);
  const playerBoardCoords = boardSize - 1;
  const positions = [
    [0, 0], // Player 1
    [playerBoardCoords, playerBoardCoords], // Player 2
    [0, playerBoardCoords], // Player 3
    [playerBoardCoords, 0], // Player 4
  ];

  const [row, col] = positions[player - 1];
  newBoard[row][col].flag = { player };

  const soldierPositions = [
    [
      [row, col + 1],
      [row + 1, col],
      [row + 1, col + 1],
      [row, col + 2],
      [row + 2, col],
    ],
    [
      [row, col - 1],
      [row - 1, col],
      [row - 1, col - 1],
      [row, col - 2],
      [row - 2, col],
    ],
    [
      [row, col - 1],
      [row + 1, col],
      [row + 1, col - 1],
      [row, col - 2],
      [row + 2, col],
    ],
    [
      [row, col + 1],
      [row - 1, col],
      [row - 1, col + 1],
      [row, col + 2],
      [row - 2, col],
    ],
  ];

  soldierPositions[player - 1].forEach(([r, c]) => {
    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      newBoard[r][c].soldier = { player };
    }
  });

  return newBoard;
};

export const createInitialBoard = (
  topics: Topic[],
  numberOfPlayers: number,
  boardSize: number
): Cell[][] => {
  let newBoard: Cell[][] = [];
  for (let i = 0; i < boardSize; i++) {
    newBoard[i] = [];
    for (let j = 0; j < boardSize; j++) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      newBoard[i][j] = { topic, soldier: null, flag: null };
    }
  }

  for (let player = 1; player <= numberOfPlayers; player++) {
    newBoard = placePieces(newBoard, player, boardSize);
  }

  return newBoard;
};

export const moveSoldier = (
  board: Cell[][],
  from: { row: number; col: number },
  to: { row: number; col: number }
): Cell[][] => {
  const newBoard = board.map((row) => [...row]);
  const soldierToMove = newBoard[from.row][from.col].soldier;
  if (soldierToMove) {
    newBoard[from.row][from.col].soldier = null;
    newBoard[to.row][to.col].soldier = soldierToMove;
  }
  return newBoard;
};

export const checkWinCondition = (
  board: Cell[][],
  currentPlayer: number,
  activePlayers: number[],
  boardSize: number
): boolean => {
  const playerBoardCoords = boardSize - 1;
  // Check if current player has captured any opponent's flag
  const flagPositions = [
    { row: 0, col: 0 },
    { row: playerBoardCoords, col: playerBoardCoords },
    { row: 0, col: playerBoardCoords },
    { row: playerBoardCoords, col: 0 },
  ];

  for (let player of activePlayers) {
    if (player !== currentPlayer) {
      const flagPos = flagPositions[player - 1];
      if (board[flagPos.row][flagPos.col].soldier?.player === currentPlayer) {
        return true;
      }
    }
  }

  // Check if current player is the only one with soldiers left
  const playersWithSoldiers = new Set(
    board.flatMap((row) =>
      row.filter((cell) => cell.soldier !== null).map((cell) => cell.soldier!.player)
    )
  );

  return playersWithSoldiers.size === 1 && playersWithSoldiers.has(currentPlayer);
};
