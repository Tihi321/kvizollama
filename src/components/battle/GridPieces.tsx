import { styled } from "solid-styled-components";
export const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
  width: 100%;
  height: fit-content;
  border: 1px solid ${(props) => props?.theme?.colors.border};
`;

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
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: ${(props) => props.backgroundColor};
  }

  &:hover {
    opacity: 0.8;
  }
`;
