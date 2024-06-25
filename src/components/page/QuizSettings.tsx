import { Component, createSignal, onMount } from "solid-js";
import { Button, TextField, Box } from "@suid/material";
import { Container } from "../layout/Container";
import { getStringValue, saveStringValue } from "../../hooks/local";
import { isEmpty } from "lodash";

interface QuizSettingsProps {
  onBack: () => void;
}

export const QuizSettings: Component<QuizSettingsProps> = ({ onBack }) => {
  const [perplexityApi, setPerplexityApi] = createSignal("");

  onMount(() => {
    const localQuizes = getStringValue("perplexityApi");
    setPerplexityApi(localQuizes);
  });

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          gap: 2,
          flex: 1,
        }}
      >
        <TextField
          fullWidth
          label="Perplexity API"
          value={perplexityApi()}
          onChange={(e) => setPerplexityApi(e.target.value)}
          margin="normal"
          type="password"
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            gap: 2,
            flex: 1,
          }}
        >
          <Button
            disabled={isEmpty(perplexityApi())}
            variant="contained"
            color="primary"
            onClick={() => {
              saveStringValue("perplexityApi", perplexityApi());
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              saveStringValue("perplexityApi", "");
              setPerplexityApi("");
            }}
          >
            Remove
          </Button>
        </Box>
      </Box>
      <Button variant="contained" color="primary" onClick={onBack}>
        Back
      </Button>
    </Container>
  );
};
