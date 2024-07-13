import { Question, Topic } from "./types";

// Function to generate a vibrant color
const getVibrantColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 50;
  const lightness = Math.floor(Math.random() * 20) + 70;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Function to generate topics from questions
export const generateTopics = (questions: Question[]): Topic[] => {
  const uniqueTopics = Array.from(new Set(questions.map((q) => q.topic)));
  return uniqueTopics.map((topic) => ({
    name: topic,
    color: getVibrantColor(),
  }));
};
