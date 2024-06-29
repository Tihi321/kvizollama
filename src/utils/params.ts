export const getQuizmUrl = () => {
  // Construct a URL object using the current window location
  const url = new URL(window.location.href);

  // Use URLSearchParams to work with the query parameters easily
  const params = new URLSearchParams(url.search);

  // Get the value of the 'quiz' parameter
  const quizValue = params.get("quiz");

  return quizValue; // This will be the value of the 'quiz' parameter or null if not present
};

export const getQuizTitle = () => {
  // Construct a URL object using the current window location
  const url = new URL(window.location.href);

  // Use URLSearchParams to work with the query parameters easily
  const params = new URLSearchParams(url.search);

  // Get the value of the 'quiz' parameter
  const quizValue = params.get("title");

  return quizValue; // This will be the value of the 'quiz' parameter or null if not present
};
