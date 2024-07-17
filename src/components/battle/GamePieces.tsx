import { styled } from "solid-styled-components";
import { getPlayerColor } from "./utils";

export const Legend = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  margin-top: 20px;
  border: 1px solid ${(props) => props?.theme?.colors.border};
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

export const Container = styled.div`
  max-width: 920px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  position: relative;
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 20px;
  width: 100%;
`;

export const Sidebar = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid ${(props) => props?.theme?.colors.border};
  padding: 10px;
`;

export const GameMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
`;

export const MenuButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 10px;

  &:hover {
    background-color: #2980b9;
  }
`;

export const Players = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Player = styled.div<{ active: boolean; player: number }>`
  padding: 10px;
  border-radius: 5px;
  color: white;
  background-color: ${(props) => (props.active ? getPlayerColor(props.player) : "#2c3e50")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
`;
