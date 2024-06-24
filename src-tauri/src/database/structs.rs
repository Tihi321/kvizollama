use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Answer {
    answer: String,
    correct: bool,
    points: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Question {
    question: String,
    answers: Vec<Answer>,
    hint: String,
    explanation: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Topics {
    topic: String,
    difficulty: String,
    questions: Vec<Question>,
}

#[derive(Serialize, Deserialize)]
pub struct QuizInfo {
    name: String,
    difficulty: String,
    data: Vec<Topics>,
}

#[derive(Deserialize)]
pub struct QuizQuestionRequest {
    pub name: String,
    pub topics: Vec<String>,
    pub difficulty: String,
    pub num_questions: u32,
    pub max_points: u32,
}
