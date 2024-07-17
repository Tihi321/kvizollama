import { styled } from "solid-styled-components";

export const DifficultyBadge = styled.span<{ difficulty: string }>`
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8em;
  margin-left: 10px;
  background-color: ${(props) =>
    props.difficulty === "easy"
      ? "#2ecc71"
      : props.difficulty === "medium"
      ? "#f39c12"
      : "#e74c3c"};
  color: white;
`;

export const ModalTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ModalQuestion = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

export const ExplanationText = styled.p`
  margin-top: 20px;
  font-style: italic;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
`;

export const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  border-radius: 5px;
`;

export const CloseButton = styled.button`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  background-color: transparent;

  &:hover {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;
export const AnswerButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  height: 62px;
  font-size: 18px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

export const RulesModalContent = ({
  onClose,
  numberOfPlayers,
}: {
  onClose: () => void;
  numberOfPlayers: number;
}) => {
  return (
    <ModalContent>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <h2>Game Rules ({numberOfPlayers}-Player Mode)</h2>
      <ul>
        <li>
          Each player starts with 5 soldiers in a formation around their flag in one corner of the
          board.
        </li>
        <li>
          Players have different colored soldiers: Player 1 (Blue), Player 2 (Red), Player 3
          (Green), Player 4 (Orange).
        </li>
        <li>Players take turns moving their soldiers.</li>
        <li>To move, a player must correctly answer a question related to the square's topic.</li>
        <li>If attacking an opponent's square, the player must answer 2 questions correctly.</li>
        <li>Soldiers can move to adjacent squares (up, down, left, right).</li>
        <li>The goal is to capture an opponent's flag or eliminate all other players' soldiers.</li>
        <li>
          The game ends when a player captures an opponent's flag or when only one player has
          soldiers remaining on the board.
        </li>
      </ul>
    </ModalContent>
  );
};
