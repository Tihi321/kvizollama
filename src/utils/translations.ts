export const getDifficultyTranslationString = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
    case "Easy":
      return "easy";
    case "normal":
    case "Normal":
      return "medium";
    case "hard":
    case "Hard":
      return "hard";
    default:
      return "";
  }
};
