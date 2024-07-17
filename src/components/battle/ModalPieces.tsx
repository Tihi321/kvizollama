import { Button, IconButton } from "@suid/material";
import { styled } from "solid-styled-components";
import { Close } from "../icons/Close";

export const ModalContent = styled.div`
  padding: 20px;
  border: 1px solid #888;
  border-radius: 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props?.theme?.colors.lightBackground};
`;

export const CenterContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  align-self: center;
  flex: 1;
`;

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

export const ModalTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ModalQuestionInfo = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => props?.theme?.colors.border};
`;

export const ModalQuestion = styled.div`
  font-size: 28px;
  margin-bottom: 20px;
`;

export const ModalAnswers = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  margin-bottom: 16px;

  @media (min-width: 700px) {
    gap: 16px;
    grid-template-columns: 1fr 1fr;
  }
`;

export const ExplanationText = styled.p`
  margin-top: 20px;
  font-style: italic;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
`;

export const AnswerButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #3498db;
  border: 2px solid currentColor;
  border-radius: 5px;
  line-height: 1.5;
  cursor: pointer;
`;

export const IconButtonStyled = styled(IconButton)`
  position: absolute !important;
  top: 20px;
  right: 20px;
  svg {
    width: 24px;
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
      <CenterContent>
        <Button
          variant="contained"
          color="warning"
          onClick={onClose}
          sx={{ alignSelf: "flex-end" }}
        >
          <Close />
        </Button>
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
          <li>
            The goal is to capture an opponent's flag or eliminate all other players' soldiers.
          </li>
          <li>
            The game ends when a player captures an opponent's flag or when only one player has
            soldiers remaining on the board.
          </li>
        </ul>
      </CenterContent>
    </ModalContent>
  );
};
