import { styled } from "solid-styled-components";
export const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
  margin-top: 20px;
`;

export const Square = styled.div<{ backgroundColor: string }>`
  aspect-ratio: 1 / 1;
  border-radius: 5px;
  color: white;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  background-color: ${(props) => props.backgroundColor};

  &:hover {
    opacity: 0.8;
  }
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 10px;
`;

export const ColorSquare = styled.div<{ backgroundColor: string }>`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.backgroundColor};
  margin-right: 5px;
`;
