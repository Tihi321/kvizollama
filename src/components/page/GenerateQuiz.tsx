import { createEffect, createSignal } from "solid-js";
import { onMount } from "solid-js";
import M from "materialize-css";

export const GenerateQuiz = () => {
  let selectElement: HTMLSelectElement;

  const [subjects, setSubjects] = createSignal("");
  const [difficulty, setDifficulty] = createSignal("easy");
  const [questionsPerTopic, setQuestionsPerTopic] = createSignal(4);
  const [maxPointsPerQuestion, setMaxPointsPerQuestion] = createSignal(10);
  const [message, setMessage] = createSignal("");

  onMount(() => {
    M.FormSelect.init(selectElement);
  });

  createEffect(() => {
    console.log("message:", message());
  });

  const generateQuiz = (event: any) => {
    event.preventDefault();
    if (!subjects() || !difficulty() || !questionsPerTopic() || !maxPointsPerQuestion()) {
      setMessage("Please fill in all fields");
      return;
    }

    const quizConfig = {
      subjects: subjects()
        .split(",")
        .map((s) => s.trim()),
      difficulty: difficulty(),
      questionsPerTopic: questionsPerTopic(),
      maxPointsPerQuestion: maxPointsPerQuestion(),
    };

    console.log("Quiz Configuration:", quizConfig);
    setMessage("Quiz configuration generated! Check the console for details.");

    // Reset form
    setSubjects("");
    setDifficulty("");
    setQuestionsPerTopic(4);
    setMaxPointsPerQuestion(10);
  };

  return (
    <>
      <main>
        <form onSubmit={generateQuiz}>
          <div class="row">
            <div class="input-field col s12">
              <input
                id="subjects"
                type="text"
                value={subjects()}
                onInput={(e) => setSubjects(e.target.value)}
              />
              <label for="subjects">Subjects (comma-separated)</label>
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
