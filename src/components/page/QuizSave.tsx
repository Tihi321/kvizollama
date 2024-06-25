import { Component, createMemo, createSignal, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import { emit } from "@tauri-apps/api/event";
import { Button, TextField, Box } from "@suid/material";
import { QuizInfo } from "../../types";
import { getLocalQuizes, saveLocalQuiz } from "../../hooks/local";
import { find, get, isEmpty, map } from "lodash";
import { openFile } from "../../hooks/file";
import { Container } from "../layout/Container";

const FullWidthButton = styled(Button)`
  width: 100%;
`;

interface QuizSaveProps {
  onBack: () => void;
  isApp: boolean;
}

export const QuizSave: Component<QuizSaveProps> = ({ onBack, isApp }) => {
  const [localQuizes, setLocalQuizes] = createSignal<QuizInfo[]>([]);
  const [localName, setLocalName] = createSignal("");
  const [localQuiz, setLocalQuiz] = createSignal("");

  const disabled = createMemo(() => {
    if (isEmpty(localName()) || isEmpty(localQuiz())) {
      return true;
    }

    const found = find(localQuizes(), (quiz) => quiz.name === localName());
    return Boolean(found);
  });

  onMount(() => {
    const localQuizes = getLocalQuizes();
    setLocalQuizes(localQuizes);
  });

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          flex: 1,
          gap: 2,
        }}
      >
        <Box>
          <TextField
            fullWidth
            label="Name of the quiz"
            value={localName()}
            onChange={(e) => setLocalName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Quiz Data"
            value={localQuiz()}
            onChange={(e) => setLocalQuiz(e.target.value)}
            margin="normal"
          />
          <FullWidthButton
            onClick={() => {
              const localQuizes = saveLocalQuiz(localName(), localQuiz());
              setLocalQuizes(localQuizes);
              setLocalName("");
              setLocalQuiz("");
            }}
            variant="contained"
            color="primary"
            disabled={disabled()}
            sx={{ marginBottom: 4 }}
          >
            Save to local Storage
          </FullWidthButton>
        </Box>
        {isApp && (
          <FullWidthButton
            onClick={async () => {
              const selected = (await openFile()) as string;
              if (isEmpty(selected)) {
                return;
              }
              emit(
                "import_quiz",
                map(selected, (file) => get(file, ["path"]))
              );
            }}
            variant="contained"
            color="primary"
          >
            Import File to disk
          </FullWidthButton>
        )}
      </Box>
      <Button onClick={onBack} variant="contained" color="primary">
        Back
      </Button>
    </Container>
  );
};
