interface Message {
  role: string;
  content: string;
}

interface RequestData {
  model: string;
  messages: Message[];
}
export const getHeaders = (api: string) => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${api}`,
  };
};

export const generateData = (system: string, question: string, model: string): RequestData => {
  return {
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: question },
    ],
  };
};
