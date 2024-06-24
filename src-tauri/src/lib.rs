mod database;
mod llm;
mod utils;

use database::{
    disk::{add_quiz, get_quizes, import_quizes, remove_quiz},
    structs::{QuizQuestionRequest, Topics},
};
use llm::requests::generate_quiz_questions;
use serde_json::Error as SerdeError;
use tauri::Manager;
use utils::{constants::WINDOW_LABEL, index::create_window};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    let _ = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(move |app| {
            let app_handle = app.app_handle();
            let generate_quiz_handle = app_handle.clone();
            let get_quizes_handle = app_handle.clone();
            let remove_quiz_handle = app_handle.clone();
            let import_quiz_handle = app_handle.clone();

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
                                    let clean_response = response
                                        .trim_start_matches("```json")
                                        .trim_end_matches("```");
                                    println!("Attempting to parse JSON: {}", clean_response);

                                    let quiz_info: Result<Vec<Topics>, SerdeError> =
                                        serde_json::from_str(clean_response);
                                    match quiz_info {
                                        Ok(quiz_info) => {
                                            // Add the serialized JSON string as a quiz
                                            add_quiz(&name, quiz_info).expect("Failed to add quiz");
                                        }
                                        Err(e) => {
                                            println!("{}", clean_response);
                                            println!("Failed to parse JSON: {}", e);
                                        }
                                    }
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
                let clean_response = name.trim_start_matches('"').trim_end_matches('"');
                remove_quiz(clean_response).expect("Failed to remove quiz");
                let quizes = get_quizes().expect("Failed to remove quizes");
                // Use the app_handle to get the window by its label
                if let Some(window) = remove_quiz_handle.get_webview_window(WINDOW_LABEL) {
                    // Now you can interact with the window, e.g., emit an event back to it
                    window
                        .emit_to(WINDOW_LABEL, "quizes", quizes)
                        .expect("Failed to emit event");
                }
            });

            app.listen_any("import_quiz", move |event| {
                let values = event.payload();
                // Attempt to parse the JSON payload into a Vec<String>
                match serde_json::from_str::<Vec<String>>(values) {
                    Ok(paths) => {
                        println!("Parsed paths: {:?}", paths);
                        import_quizes(paths).expect("Failed to import quizes");
                    }
                    Err(e) => eprintln!("Failed to parse paths: {}", e),
                }
                let quizes = get_quizes().expect("Failed to import quizes");
                // Use the app_handle to get the window by its label
                if let Some(window) = import_quiz_handle.get_webview_window(WINDOW_LABEL) {
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
