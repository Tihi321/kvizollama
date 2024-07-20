import { createSignal, onMount, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { getStringValue } from "../../hooks/local";

export const Square = styled.div<{ backgroundColor: string }>`
  aspect-ratio: 1 / 1;
  border-radius: 5px;
  color: white;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  background-color: ${(props) => props?.theme?.colors.lightBackground};

  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 5px;
    right: 5px;
    width: 20%;
    height: 20%;
    border-radius: 50%;
    background-color: ${(props) => props.backgroundColor};
  }

  &:hover {
    opacity: 0.8;
  }
`;

const GameBoardContainer = styled.div<{ boardSize: number }>`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.boardSize}, 1fr)`};
  gap: 5px;
  width: 100%;
  height: fit-content;
  border: 1px solid ${(props) => props?.theme?.colors.border};
`;

export const GameBoard = ({ children }: { children: any }) => {
  const [boardSize, setBoardSize] = createSignal(0);

  onMount(() => {
    const storedBoardSize = Number(getStringValue(`kvizolamma/boardsize`)) || 8;
    setBoardSize(storedBoardSize);
  });
  return (
    <Show when={boardSize() > 0}>
      <GameBoardContainer boardSize={boardSize()}>{children}</GameBoardContainer>
    </Show>
  );
};
