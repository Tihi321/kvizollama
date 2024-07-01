import { Component, createMemo, createSignal } from "solid-js";
import { styled } from "solid-styled-components";
import { emit } from "@tauri-apps/api/event";
import { Button, TextField, Box } from "@suid/material";
import { saveCustomQuiz, saveLocalQuiz } from "../../hooks/local";
import { get, isEmpty, map } from "lodash";
import { openFile } from "../../hooks/file";
import { Container } from "../layout/Container";
import { Back } from "../icons/Back";
import { useTranslations } from "../../hooks/translations";

const FullWidthButton = styled(Button)`
  width: 100%;
`;

interface QuizSaveProps {
  onBack: () => void;
  isApp: boolean;
}

export const QuizSave: Component<QuizSaveProps> = ({ onBack, isApp }) => {
  const [localName, setLocalName] = createSignal("");
  const [localQuiz, setLocalQuiz] = createSignal("");
  const [customName, setCustomName] = createSignal("");
  const [customQuiz, setCustomQuiz] = createSignal("");
  const { getTranslation } = useTranslations();

  const saveLocalQuizDisabled = createMemo(() => isEmpty(localName()) || isEmpty(localQuiz()));
  const savelCustomQuizDisabled = createMemo(() => isEmpty(customName()) || isEmpty(customQuiz()));

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
            label={getTranslation("quiz_name")}
            value={localName()}
            onChange={(e) => setLocalName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label={getTranslation("quiz_data")}
            value={localQuiz()}
            onChange={(e) => setLocalQuiz(e.target.value)}
            margin="normal"
          />
          <FullWidthButton
            onClick={() => {
              saveLocalQuiz(localName(), localQuiz());
              setLocalName("");
              setLocalQuiz("");
            }}
            variant="contained"
            color="primary"
            disabled={saveLocalQuizDisabled()}
            sx={{ marginBottom: 4 }}
          >
            {getTranslation("save_to_local_storage")}
          </FullWidthButton>
        </Box>
        <Box>
          <TextField
            fullWidth
            label={getTranslation("quiz_name")}
            value={customName()}
            onChange={(e) => setCustomName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label={getTranslation("quiz_url")}
            value={customQuiz()}
            onChange={(e) => setCustomQuiz(e.target.value)}
            margin="normal"
          />
          <FullWidthButton
            onClick={() => {
              saveCustomQuiz(customName(), customQuiz());
              setCustomName("");
              setCustomQuiz("");
            }}
            variant="contained"
            color="primary"
            disabled={savelCustomQuizDisabled()}
            sx={{ marginBottom: 4 }}
          >
            {getTranslation("save_to_local_storage")}
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
            {getTranslation("import_file")}
          </FullWidthButton>
        )}
      </Box>
      <Button onClick={onBack} variant="contained" color="info">
        <Back />
      </Button>
    </Container>
  );
};
