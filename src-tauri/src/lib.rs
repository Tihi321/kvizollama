mod utils;

use tauri::Manager;
use utils::{constants::WINDOW_LABEL, index::create_window};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _ = tauri::Builder::default()
        .setup(move |app| {
            let app_handle = app.app_handle();
            let generate_quiz_handle = app_handle.clone();

            let _ = create_window(&app).unwrap();

            app.listen_any("generate_quiz_question", move |_| {
                let window = generate_quiz_handle
                    .get_webview_window(WINDOW_LABEL)
                    .unwrap();

                window
                    .emit_to(WINDOW_LABEL, "generate_quiz_question_response", true)
                    .expect("Failed to emit event");
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
