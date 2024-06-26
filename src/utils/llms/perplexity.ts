import { QuizFormData } from "../../types";

interface Message {
  role: string;
  content: string;
}

interface RequestData {
  model: string;
  messages: Message[];
}

const perplexitUrl = "https://api.perplexity.ai/chat/completions";

const getHeaders = (api: string) => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${api}`,
  };
};

const generateData = (system: string, question: string): RequestData => {
  return {
    model: "llama-3-sonar-small-32k-chat",
    messages: [
      { role: "system", content: system },
      { role: "user", content: question },
    ],
  };
};

const formatLldRequest = (
  topics: string[],
  difficulty: string,
  numQuestions: number,
  maxPoints: number
): string => {
  return `Topics: [${topics.join(", ")}]\n\
  Maximum Difficulty: [${difficulty}]\n\
  Number of Questions per Topic: [${numQuestions}]\n\
  Maximum Total Points: [${maxPoints}]`;
};

export const fetchPerplexityApi = async (
  api: string,
  system: string,
  data: QuizFormData
): Promise<any> => {
  try {
    const headers = getHeaders(api);
    const body = generateData(
      system,
      formatLldRequest(data.topics, data.difficulty, data.num_questions, data.max_points)
    );

    const response = await fetch(perplexitUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: any = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
