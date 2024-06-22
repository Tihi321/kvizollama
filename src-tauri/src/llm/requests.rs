use ollama_rs::generation::completion::request::GenerationRequest;
use ollama_rs::Ollama;

use super::constamts::SYSTEM_PROMPT;

fn format_lld_request(
    topics: &[String],
    difficulty: &str,
    num_questions: u32,
    max_points: u32,
) -> String {
    format!(
        "Topics: [{}]\n\
         Maximum Difficulty: [{}]\n\
         Number of Questions per Topic: [{}]\n\
         Maximum Total Points: [{}]",
        topics.join(", "),
        difficulty,
        num_questions,
        max_points
    )
}

pub async fn generate_quiz_questions(
    topics: &[String],
    difficulty: &str,
    num_questions: u32,
    max_points: u32,
) -> Result<String, Box<dyn std::error::Error>> {
    // Create an Ollama client
    let ollama = Ollama::default();

    // Use the format_lld_request function to create the user question
    let user_question = format_lld_request(topics, difficulty, num_questions, max_points);

    // Create the generation request
    let request = GenerationRequest::new(
        "qwen2:7b".to_string(),
        format!("\n\nHuman: {}\n\nAssistant:", user_question),
    )
    .system(SYSTEM_PROMPT.to_string());

    // Send the request and get the response
    let response = ollama.generate(request).await?;

    Ok(response.response)
}
