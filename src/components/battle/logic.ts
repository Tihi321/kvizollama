import { Cell, Topic } from "./types";

const placePieces = (board: Cell[][], row: number, col: number, player: number): Cell[][] => {
  const newBoard = board.map((row) => [...row]);
  newBoard[row][col].flag = { player };
  const positions =
    player === 1
      ? [
          [row, col + 1],
          [row + 1, col],
          [row + 1, col + 1],
          [row, col + 2],
          [row + 2, col],
        ]
      : [
          [row, col - 1],
          [row - 1, col],
          [row - 1, col - 1],
          [row, col - 2],
          [row - 2, col],
        ];

  positions.forEach(([r, c]) => {
    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      newBoard[r][c].soldier = { player };
    }
  });
  return newBoard;
};

export const createInitialBoard = (topics: Topic[]): Cell[][] => {
  const newBoard: Cell[][] = [];
  for (let i = 0; i < 8; i++) {
    newBoard[i] = [];
    for (let j = 0; j < 8; j++) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      newBoard[i][j] = { topic, soldier: null, flag: null };
    }
  }
  return placePieces(placePieces(newBoard, 0, 0, 1), 7, 7, 2);
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

export const checkWinCondition = (board: Cell[][], currentPlayer: number): boolean => {
  const opponentPlayer = currentPlayer === 1 ? 2 : 1;
  const opponentFlagPosition = opponentPlayer === 1 ? { row: 0, col: 0 } : { row: 7, col: 7 };

  if (board[opponentFlagPosition.row][opponentFlagPosition.col].soldier?.player === currentPlayer) {
    return true;
  }

  return !board.some((row) => row.some((cell) => cell.soldier?.player === opponentPlayer));
};
