export const getDifficultyTranslationString = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
    case "Easy":
      return "easy";
    case "normal":
    case "Normal":
      return "normal";
    case "hard":
    case "Hard":
      return "hard";
    default:
      return "";
  }
};
