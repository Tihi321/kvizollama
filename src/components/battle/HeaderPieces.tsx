import { styled } from "solid-styled-components";

export const HeaderInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  gap: 10px;
`;
export const ButtonHeaderContainer = styled.div`
  flex: 1;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

export const StyledHeaderButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;
