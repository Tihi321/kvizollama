import { Question, Topic } from "./types";

export const getPlayerColor = (player: number): string => {
  const colors = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12"];
  return colors[player - 1] || colors[0];
};

// Function to generate a vibrant color
const getVibrantColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 50;
  const lightness = Math.floor(Math.random() * 20) + 70;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Function to save topic colors to localStorage
const saveTopicColors = (topicColors: Record<string, string>) => {
  localStorage.setItem("kvizolamma/topiccolors", JSON.stringify(topicColors));
};

// Function to get topic colors from localStorage
const getTopicColors = (): Record<string, string> => {
  const storedColors = localStorage.getItem("kvizolamma/topiccolors");
  return storedColors ? JSON.parse(storedColors) : {};
};

// Function to generate or retrieve a color for a topic
const getTopicColor = (topic: string, topicColors: Record<string, string>): string => {
  if (topicColors[topic]) {
    return topicColors[topic];
  } else {
    const newColor = getVibrantColor();
    topicColors[topic] = newColor;
    return newColor;
  }
};

// Function to remove unused topics from localStorage
const removeUnusedTopics = (usedTopics: string[]) => {
  const topicColors = getTopicColors();
  const updatedTopicColors: Record<string, string> = {};

  usedTopics.forEach((topic) => {
    if (topicColors[topic]) {
      updatedTopicColors[topic] = topicColors[topic];
    }
  });

  saveTopicColors(updatedTopicColors);
};

// Function to generate topics from questions
export const generateTopics = (questions: Question[]): Topic[] => {
  const uniqueTopics = Array.from(new Set(questions.map((q) => q.topic)));
  const topicColors = getTopicColors();

  const topics = uniqueTopics.map((topic) => ({
    name: topic,
    color: getTopicColor(topic, topicColors),
  }));

  saveTopicColors(topicColors);
  removeUnusedTopics(uniqueTopics);

  return topics;
};
