import { Component, createEffect, createSignal } from "solid-js";
import { emit } from "@tauri-apps/api/event";
import { onMount } from "solid-js";
import M from "materialize-css";

interface GenerateQuizProps {
  setLoading: (isLoading: boolean) => void;
}

export const GenerateQuiz: Component<GenerateQuizProps> = (props) => {
  let selectElement: HTMLSelectElement;

  const [topics, setTopics] = createSignal("");
  const [difficulty, setDifficulty] = createSignal("easy");
  const [questionsPerTopic, setQuestionsPerTopic] = createSignal(4);
  const [maxPointsPerQuestion, setMaxPointsPerQuestion] = createSignal(10);

  onMount(() => {
    M.FormSelect.init(selectElement);
  });

  const generateQuiz = (event: any) => {
    event.preventDefault();
    if (!topics() || !difficulty() || !questionsPerTopic() || !maxPointsPerQuestion()) {
      return;
    }

    const quizConfig = {
      topics: topics()
        .split(",")
        .map((s) => s.trim()),
      difficulty: difficulty(),
      num_questions: questionsPerTopic(),
      max_points: maxPointsPerQuestion(),
    };

    console.log("Quiz Configuration:", quizConfig);
    emit("generate_quiz_question", quizConfig);
    props.setLoading(true);
  };

  return (
    <>
      <main>
        <form onSubmit={generateQuiz}>
          <div class="row">
            <div class="input-field col s12">
              <input
                id="topics"
                type="text"
                value={topics()}
                onInput={(e) => setTopics(e.target.value)}
              />
              <label for="topics">Topics (comma-separated)</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <select
                id="difficulty"
                value={difficulty()}
                onChange={(e) => setDifficulty(e.target.value)}
                ref={(el) => (selectElement = el)} // This line is added to bind the selectElement variable
              >
                <option value="" disabled selected>
                  Choose difficulty
                </option>
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
              </select>
              <label>Difficulty</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input
                id="questionsPerTopic"
                type="number"
                min="1"
                value={questionsPerTopic()}
                onInput={(e) => setQuestionsPerTopic(parseInt(e.target.value))}
              />
              <label for="questionsPerTopic">Number of questions per topic</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input
                id="maxPointsPerQuestion"
                type="number"
                min="1"
                value={maxPointsPerQuestion()}
                onInput={(e) => setMaxPointsPerQuestion(parseInt(e.target.value))}
              />
              <label for="maxPointsPerQuestion">Maximum points per question</label>
            </div>
          </div>
          <div class="row">
            <div class="col s12 center-align">
              <button type="submit" class="btn waves-effect waves-light">
                Generate Quiz
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};
