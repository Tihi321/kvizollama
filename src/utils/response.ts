import { Topic } from "../types";

// Function to parse JSON string
export const parseResponseJson = (jsonString: string): Topic[] | [] => {
  try {
    const topics: Topic[] = JSON.parse(jsonString);
    return topics;
  } catch (error) {
    console.error("Error parsing JSON string:", error);
    return [];
  }
};

export const cleanString = (input: string): string => {
  // This regex matches ```json at the start and ``` at the end of the string
  const regex = /^```json|```$/g;
  return input.replace(regex, "");
};
