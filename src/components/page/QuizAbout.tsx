import { Component } from "solid-js";
import { Button, Box } from "@suid/material";
import { Container } from "../layout/Container";
import { Back } from "../icons/Back";

interface QuizAboutmProps {
  systemPrompt: string;
  onBack: () => void;
}

export const QuizAbout: Component<QuizAboutmProps> = ({ systemPrompt, onBack }) => {
  return (
    <Container>
      <Box sx={{ margin: "auto", display: "flex", flexDirection: "column", gap: 2, fontSize: 18 }}>
        <p>
          This quiz app uses large language models (LLMs) to create interactive quizzes on various
          topics. You can add your preferred LLM API key in the settings to enable quiz generation.
          The app supports both cloud-based LLMs and local models through Ollama integration for
          offline functionality. To generate a quiz, simply enter a topic or subject area in the app
          interface. The connected LLM will then create relevant multiple-choice questions on that
          topic. You can adjust parameters like difficulty level, number of questions, and quiz
          format to customize the experience. The app offers a seamless built-in interface. It's
          ideal for students, teachers, and lifelong learners to create engaging practice quizzes on
          any subject on demand.
        </p>
        <p>
          Whether you're looking for a quick knowledge check or in-depth study materials, this
          LLM-powered quiz app provides an easy way to generate educational content tailored to your
          needs. Let artificial intelligence be your study buddy and quiz master!
        </p>
        <p>
          You can pass url to the app it will be loaded at the start of the app. Example url with:
          <br />
          <br />
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
            Copy System Prompt
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(`
              Topic: [TOPICS]
              Maximum Difficulty: [MAX_DIFFICULTY]
              Number of Questions per Topic: [NUM_QUESTIONS]
              Maximum Total Points: [MAX_POINTS],`);
            }}
            variant="contained"
            color="primary"
          >
            Copy User Prompt
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
            Copy Full Prompt
          </Button>
        </Box>
        <Button onClick={onBack} variant="contained" color="info">
          <Back />
        </Button>
      </Box>
    </Container>
  );
};
