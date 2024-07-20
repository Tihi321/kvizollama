import { Component } from "solid-js";
import { Button, Box } from "@suid/material";
import { Container } from "../layout/Container";
import { Back } from "../icons/Back";
import { useTranslations } from "../../hooks/translations";

interface GameAboutProps {
  systemPrompt: string;
  onBack: () => void;
}

export const GameAbout: Component<GameAboutProps> = ({ systemPrompt, onBack }) => {
  const { getTranslation } = useTranslations();

  return (
    <Container>
      <Box sx={{ margin: "auto", display: "flex", flexDirection: "column", gap: 2, fontSize: 18 }}>
        <p>{getTranslation("about_info")}</p>
        <p>{getTranslation("about_message")}</p>
        <p>{getTranslation("about_params")}</p>
        <p>
          ?quiz=https://cdn.tihomir-selak.from.hr/assets/api/ollama/quiz/perplexity/arts.json&title=Arts
        </p>

        <Box
          sx={{
            marginTop: "20px",
            justifyContent: "space-between",
            width: "100%",
            display: "flex",
          }}
        >
          <Button
            onClick={() => {
              navigator.clipboard.writeText(systemPrompt);
            }}
            variant="contained"
            color="primary"
          >
            {getTranslation("copy_system_prompt")}
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                `Topic: [TOPICS]\nMaximum Difficulty: [MAX_DIFFICULTY]\nNumber of Questions per Topic: [NUM_QUESTIONS]\nMaximum Total Points: [MAX_POINTS],`
              );
            }}
            variant="contained"
            color="primary"
          >
            {getTranslation("copy_user_prompt")}
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(`
              ${systemPrompt}
              ---
              Topic: [TOPICS]
              Maximum Difficulty: [MAX_DIFFICULTY]
              Number of Questions per Topic: [NUM_QUESTIONS]
              Maximum Total Points: [MAX_POINTS],`);
            }}
            variant="contained"
            color="primary"
          >
            {getTranslation("copy_full_prompt")}
          </Button>
        </Box>
        <Button onClick={onBack} variant="contained" color="info">
          <Back />
        </Button>
      </Box>
    </Container>
  );
};
