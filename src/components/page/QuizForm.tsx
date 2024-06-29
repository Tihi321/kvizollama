import { Component, createMemo, createSignal, onMount } from "solid-js";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box } from "@suid/material";
import { QuizFormData, QuizFormOptions } from "../../types";
import { Container } from "../layout/Container";
import { getStringValue } from "../../hooks/local";
import { isEmpty } from "lodash";
import { Back } from "../icons/Back";

interface QuizFormProps {
  onGenerate: (formData: QuizFormData, options: QuizFormOptions) => void;
  onBack: () => void;
  isApp: boolean;
}

export const QuizForm: Component<QuizFormProps> = ({ onGenerate, onBack, isApp }) => {
  const [type, setType] = createSignal("");
  const [localModel, setLocalModel] = createSignal("qwen2:7b");
  const [name, setName] = createSignal("");
  const [topics, setTopics] = createSignal("");
  const [difficulty, setDifficulty] = createSignal("easy");
  const [questionsPerTopic, setQuestionsPerTopic] = createSignal(4);
  const [maxPointsPerQuestion, setMaxPointsPerQuestion] = createSignal(10);
  const [perplexityApi, setPerplexityApi] = createSignal("");
  const [chatGPTApi, setChatGPTApi] = createSignal("");

  onMount(() => {
    const perplexityApi = getStringValue("perplexityApi");
    setPerplexityApi(perplexityApi);
    const chatGPTApi = getStringValue("chatgptAPI");
    setChatGPTApi(chatGPTApi);
  });

  const modeAPI = createMemo(() => {
    return type() === "perplexity" ? perplexityApi() : chatGPTApi();
  });

  const disabled = createMemo(() => {
    return (
      !type() ||
      !localModel() ||
      !name() ||
      !topics() ||
      !difficulty() ||
      !questionsPerTopic() ||
      !maxPointsPerQuestion()
    );
  });

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (disabled()) {
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

    onGenerate(formData, { model: localModel(), name: name(), type: type(), api: modeAPI() });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Model</InputLabel>
          <Select value={type()} onChange={(e) => setType(e.target.value)}>
            <MenuItem disabled={!isApp} value="ollama">
              Ollama
            </MenuItem>
            <MenuItem disabled={isEmpty(perplexityApi())} value="perplexity">
              Perplexity
            </MenuItem>
            <MenuItem disabled={isEmpty(chatGPTApi())} value="chatgpt">
              ChatGPT
            </MenuItem>
          </Select>
        </FormControl>
        {type() === "ollama" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Local model</InputLabel>
            <Select value={localModel()} onChange={(e) => setLocalModel(e.target.value)}>
              <MenuItem value="qwen2:7b">Qwen2</MenuItem>
              <MenuItem value="llama3:8b">Llama3</MenuItem>
              <MenuItem value="mistral:7b">Mistral</MenuItem>
            </Select>
          </FormControl>
        )}
        <TextField
          fullWidth
          label="Name of the quiz"
          value={name()}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
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
          <Button variant="contained" color="info" onClick={onBack}>
            <Back />
          </Button>
          <Button disabled={disabled()} type="submit" variant="contained" color="primary">
            Generate
          </Button>
        </Box>
      </form>
    </Container>
  );
};
