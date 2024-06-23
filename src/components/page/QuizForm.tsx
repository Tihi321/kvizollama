import { Component, createSignal } from "solid-js";
import { styled } from "solid-styled-components";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@suid/material";
import { QuizFormData } from "../../types";

const FormContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

interface QuizFormProps {
  onSubmit: (formData: QuizFormData) => void;
}

export const QuizForm: Component<QuizFormProps> = ({ onSubmit }) => {
  const [topics, setTopics] = createSignal("");
  const [difficulty, setDifficulty] = createSignal("easy");
  const [questionsPerTopic, setQuestionsPerTopic] = createSignal(4);
  const [maxPointsPerQuestion, setMaxPointsPerQuestion] = createSignal(10);

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (!topics() || !difficulty() || !questionsPerTopic() || !maxPointsPerQuestion()) {
      return;
    }

    const formData: QuizFormData = {
      topics: topics()
        .split(",")
        .map((s) => s.trim()),
      difficulty: difficulty(),
      num_questions: questionsPerTopic(),
      max_points: maxPointsPerQuestion(),
    };

    onSubmit(formData);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Topics (comma-separated)"
          value={topics()}
          onChange={(e) => setTopics(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Difficulty</InputLabel>
          <Select value={difficulty()} onChange={(e) => setDifficulty(e.target.value)}>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="number"
          label="Number of questions per topic"
          value={questionsPerTopic()}
          onChange={(e) => setQuestionsPerTopic(parseInt(e.target.value))}
          margin="normal"
        />
        <TextField
          fullWidth
          type="number"
          label="Maximum points per question"
          value={maxPointsPerQuestion()}
          onChange={(e) => setMaxPointsPerQuestion(parseInt(e.target.value))}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Generate Quiz
        </Button>
      </form>
    </FormContainer>
  );
};
