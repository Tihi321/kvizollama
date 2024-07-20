import { Component, createMemo, createSignal, For, onMount } from "solid-js";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box } from "@suid/material";
import { GenerateFormData, GenerateFormOptions } from "../../types";
import { Container } from "../layout/Container";
import { getStringValue } from "../../hooks/local";
import { get, isEmpty, map } from "lodash";
import { Back } from "../icons/Back";
import { useTranslations } from "../../hooks/translations";
import { formatLldRequest } from "../../utils/llms/prompt";

interface GenerateFormProps {
  onGenerate: (formData: GenerateFormData, options: GenerateFormOptions) => void;
  onBack: () => void;
  isApp: boolean;
}

export const GenerateForm: Component<GenerateFormProps> = ({ onGenerate, onBack, isApp }) => {
  const [type, setType] = createSignal("");
  const [localModel, setLocalModel] = createSignal("qwen2:7b");
  const [openAIModel, setOpenAIModel] = createSignal("gpt-4o-mini");
  const [name, setName] = createSignal("");
  const [topics, setTopics] = createSignal<Array<{ title: string; descriptions: string[] }>>([]);
  const [difficulty, setDifficulty] = createSignal("normal");
  const [questionsPerTopic, setQuestionsPerTopic] = createSignal(4);
  const [maxPointsPerQuestion, setMaxPointsPerQuestion] = createSignal(10);
  const [perplexityApi, setPerplexityApi] = createSignal("");
  const [chatGPTApi, setChatGPTApi] = createSignal("");
  const { getTranslation } = useTranslations();

  onMount(() => {
    const perplexityApi = getStringValue("kvizolamma/perplexityApi");
    setPerplexityApi(perplexityApi);
    const chatGPTApi = getStringValue("kvizolamma/chatgptAPI");
    setChatGPTApi(chatGPTApi);
  });

  const modelData = createMemo(() => {
    const api = type() === "perplexity" ? perplexityApi() : chatGPTApi();
    const model = type() === "ollama" ? localModel() : openAIModel();
    return {
      api,
      model,
    };
  });

  const topicsArray = createMemo(() => {
    return map(topics(), (values) =>
      !isEmpty(values.descriptions)
        ? `${values.title} (${values.descriptions.join("|")})`
        : values.title
    );
  });

  const disabled = createMemo(() => {
    return !type() || !name() || !topics() || !questionsPerTopic() || !maxPointsPerQuestion();
  });

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (disabled()) {
      return;
    }

    const formData: GenerateFormData = {
      topics: topicsArray(),
      difficulty: difficulty(),
      num_questions: questionsPerTopic(),
      max_points: maxPointsPerQuestion(),
    };

    const { model, api } = modelData();

    onGenerate(formData, { model, name: name(), type: type(), api });
  };

  const addTopicField = () => {
    setTopics((prevTopics) => [...prevTopics, { title: "", descriptions: [] }]);
  };

  const removeTopicField = (index: number) => {
    setTopics((prevTopics) => prevTopics.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>{getTranslation("model")}</InputLabel>
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
            <InputLabel>{getTranslation("local_model")}</InputLabel>
            <Select value={localModel()} onChange={(e) => setLocalModel(e.target.value)}>
              <MenuItem value="qwen2:7b">Qwen2</MenuItem>
              <MenuItem value="gemma2:9b">Gemma2</MenuItem>
              <MenuItem value="llama3:8b">Llama3</MenuItem>
              <MenuItem value="mistral:7b">Mistral</MenuItem>
            </Select>
          </FormControl>
        )}
        {type() === "chatgpt" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>{getTranslation("model")}</InputLabel>
            <Select value={openAIModel()} onChange={(e) => setOpenAIModel(e.target.value)}>
              <MenuItem value="gpt-4o-mini">Gpt-4o-mini</MenuItem>
              <MenuItem value="gpt-4o">Gpt-4o</MenuItem>
              <MenuItem value="gpt-4-turbo">Gpt-4-turbo</MenuItem>
              <MenuItem value="gpt-3.5-turbo">Gpt-3.5-turbo</MenuItem>
            </Select>
          </FormControl>
        )}
        <TextField
          fullWidth
          label={getTranslation("quiz_name")}
          value={name()}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <For each={topics()}>
          {(topic, index) => (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <TextField
                fullWidth
                label={`${getTranslation("topic")} ${index() + 1}`}
                defaultValue={get(topic, ["title"], "")}
                onBlur={(event: any) => {
                  setTopics((prevTopics) => {
                    const newTopics = [...prevTopics];
                    newTopics[index()] = {
                      title: event.target.value,
                      descriptions: get(topics(), [index(), "descriptions"], []),
                    };
                    return newTopics;
                  });
                }}
                margin="normal"
              />
              <For each={get(topic, ["descriptions"], [])}>
                {(description, descriptionIndex) => (
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                    <TextField
                      fullWidth
                      label={`${getTranslation("description")} ${descriptionIndex() + 1}`}
                      defaultValue={description}
                      onBlur={(event: any) => {
                        setTopics((prevTopics) => {
                          const newTopics = [...prevTopics];
                          newTopics[index()] = {
                            title: get(topics(), [index(), "title"], ""),
                            descriptions: newTopics[index()].descriptions.map((desc, i) =>
                              i === descriptionIndex() ? event.target.value : desc
                            ),
                          };
                          return newTopics;
                        });
                      }}
                      margin="normal"
                    />
                    <Button
                      onClick={() =>
                        setTopics((prevTopics) => {
                          const newTopics = [...prevTopics];
                          newTopics[index()] = {
                            title: get(topics(), [index(), "title"], ""),
                            descriptions: newTopics[index()].descriptions.filter(
                              (_, i) => i !== descriptionIndex()
                            ),
                          };
                          return newTopics;
                        })
                      }
                    >
                      Remove
                    </Button>
                  </Box>
                )}
              </For>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                <Button
                  onClick={() =>
                    setTopics((prevTopics) => {
                      const newTopics = [...prevTopics];
                      newTopics[index()] = {
                        title: get(topics(), [index(), "title"], ""),
                        descriptions: [...get(topics(), [index(), "descriptions"], []), ""],
                      };
                      return newTopics;
                    })
                  }
                >
                  Add Description
                </Button>
                <Button onClick={() => removeTopicField(index())}>Remove</Button>
              </Box>
            </Box>
          )}
        </For>
        <Button onClick={addTopicField}>Add Topic</Button>
        <FormControl fullWidth margin="normal">
          <InputLabel>{getTranslation("difficulty")}</InputLabel>
          <Select value={difficulty()} onChange={(e) => setDifficulty(e.target.value)}>
            <MenuItem value="easy">{getTranslation("easy")}</MenuItem>
            <MenuItem value="normal">{getTranslation("normal")}</MenuItem>
            <MenuItem value="hard">{getTranslation("hard")}</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="number"
          label={getTranslation("questions_per_topic")}
          value={questionsPerTopic()}
          onChange={(e) => setQuestionsPerTopic(parseInt(e.target.value))}
          margin="normal"
        />
        <TextField
          fullWidth
          type="number"
          label={getTranslation("points_per_question")}
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  formatLldRequest(
                    topicsArray(),
                    difficulty(),
                    questionsPerTopic(),
                    maxPointsPerQuestion()
                  )
                );
              }}
              variant="contained"
              color="primary"
            >
              {getTranslation("copy_quiz_prompt")}
            </Button>
            <Button disabled={disabled()} type="submit" variant="contained" color="primary">
              {getTranslation("generate")}
            </Button>
          </Box>
        </Box>
      </form>
    </Container>
  );
};
