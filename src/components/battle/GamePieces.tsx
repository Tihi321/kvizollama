import { styled } from "solid-styled-components";

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
  position: relative;
  width: 150px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid ${(props) => props?.theme?.colors.border};
  padding: 10px;
  box-sizing: border-box;
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

export const Player = styled.div<{ active: boolean; player: number; backgroundColor?: string }>`
  padding: 10px;
  border-radius: 5px;
  color: white;
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : "#2c3e50")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
`;

export const TopicContainer = styled.div<{ backgroundColor?: string }>`
  padding: 10px;
  border-radius: 5px;
  color: ${(props) => props?.theme?.colors.darkBackground};
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : "#2c3e50")};
  border: 2px solid ${(props) => props?.theme?.colors.darkBackground};
  margin: auto 0;
  transform: translateY(50%);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
`;
