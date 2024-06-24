mod database;
mod llm;
mod utils;

use database::disk::{add_quiz, get_quizes, remove_quiz};
use llm::requests::generate_quiz_questions;
use serde::Deserialize;
use tauri::Manager;
use utils::{constants::WINDOW_LABEL, index::create_window};

#[derive(Deserialize)]
struct QuizQuestionRequest {
    name: String,
    topics: Vec<String>,
    difficulty: String,
    num_questions: u32,
    max_points: u32,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    let _ = tauri::Builder::default()
        .setup(move |app| {
            let app_handle = app.app_handle();
            let generate_quiz_handle = app_handle.clone();
            let get_quizes_handle = app_handle.clone();
            let remove_quiz_handle = app_handle.clone();

            let _ = create_window(&app).unwrap();

            app.listen_any("generate_quiz", move |event| {
                let value = event.payload();
                let generate_quiz_handle_clone = generate_quiz_handle.clone();
                match serde_json::from_str::<QuizQuestionRequest>(value) {
                    Ok(payload) => {
                        let name = payload.name;
                        let topics = payload.topics;
                        let difficulty = payload.difficulty;
                        let num_questions = payload.num_questions;
                        let max_points = payload.max_points;

                        tokio::spawn(async move {
                            match generate_quiz_questions(
                                &topics,
                                &difficulty,
                                num_questions,
                                max_points,
                            )
                            .await
                            {
                                Ok(response) => {
                                    println!("Response generated: {:?}", response);
                                    let clean_response = response
                                        .trim_start_matches("```json")
                                        .trim_end_matches("```");
                                    add_quiz(&name, &clean_response).expect("Failed to add quiz");
                                    let quizes = get_quizes().expect("Failed to add quiz");
                                    // Use the app_handle to get the window by its label
                                    if let Some(window) =
                                        generate_quiz_handle_clone.get_webview_window(WINDOW_LABEL)
                                    {
                                        // Now you can interact with the window, e.g., emit an event back to it
                                        window
                                            .emit_to(WINDOW_LABEL, "quizes", quizes)
                                            .expect("Failed to emit event");
                                    }
                                }
                                Err(e) => println!("Error generating questions: {}", e),
                            }
                        });
                    }
                    Err(e) => eprintln!("Failed to parse event payload: {}", e),
                }
            });

            app.listen_any("get_quizes", move |_| {
                let quizes = get_quizes().expect("Failed to get quizes");
                // Use the app_handle to get the window by its label
                if let Some(window) = get_quizes_handle.get_webview_window(WINDOW_LABEL) {
                    // Now you can interact with the window, e.g., emit an event back to it
                    window
                        .emit_to(WINDOW_LABEL, "quizes", quizes)
                        .expect("Failed to emit event");
                }
            });

            app.listen_any("remove_quiz", move |event| {
                let name = event.payload();
                remove_quiz(name).expect("Failed to remove quiz");
                let quizes = get_quizes().expect("Failed to get quizes");
                // Use the app_handle to get the window by its label
                if let Some(window) = remove_quiz_handle.get_webview_window(WINDOW_LABEL) {
                    // Now you can interact with the window, e.g., emit an event back to it
                    window
                        .emit_to(WINDOW_LABEL, "quizes", quizes)
                        .expect("Failed to emit event");
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
