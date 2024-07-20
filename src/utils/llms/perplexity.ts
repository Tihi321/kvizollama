import { GenerateFormData } from "../../types";
import { formatLldRequest } from "./prompt";
import { generateData, getHeaders } from "./requests";
import { PERPLEXITY_ENDPOINT } from "./constants";
import { get } from "lodash";
import { parseJsonFromString } from "../response";

export const fetchPerplexityApi = async (
  api: string,
  system: string,
  data: GenerateFormData
): Promise<any> => {
  try {
    const headers = getHeaders(api);
    const body = generateData(
      system,
      formatLldRequest(data.topics, data.difficulty, data.num_questions, data.max_points),
      "llama-3-sonar-small-32k-chat"
    );

    const response = await fetch(PERPLEXITY_ENDPOINT, {
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
    throw error;
  }
};
