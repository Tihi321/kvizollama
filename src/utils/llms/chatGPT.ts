import { GenerateFormData } from "../../types";
import { formatLldRequest } from "./prompt";
import { generateData, getHeaders } from "./requests";
import { OPEN_AI_ENDPOINTS } from "./constants";
import { get } from "lodash";
import { parseJsonFromString } from "../response";

export const fetchOpenAIApi = async (
  api: string,
  system: string,
  data: GenerateFormData,
  model: string = "gpt-4o-mini"
): Promise<any> => {
  try {
    const headers = getHeaders(api);
    const body = generateData(
      system,
      formatLldRequest(data.topics, data.difficulty, data.num_questions, data.max_points),
      model
    );

    const response = await fetch(OPEN_AI_ENDPOINTS, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseJson: any = await response.json();

    const result = get(responseJson, ["choices", 0, "message", "content"], "");
    return parseJsonFromString(result);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
