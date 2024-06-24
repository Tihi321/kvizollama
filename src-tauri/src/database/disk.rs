use std::fs::{self, File};
use std::io::Write;
use std::io::{self, Read};
use std::path::Path;
use std::result::Result;

use super::constants::QUIZES_FOLDER;

pub fn add_quiz(quiz_name: &str, values: &str) -> Result<(), std::io::Error> {
    let path = Path::new(QUIZES_FOLDER);
    // Ensure the "quizes" folder exists
    if !path.exists() {
        fs::create_dir_all(&path)?;
        println!("Folder 'quizes' created successfully.");
    }

    // Construct the path to the quiz file
    let file_path = path.join(format!("{}.txt", quiz_name));

    // Create or overwrite the file with the given name and write the values to it
    let mut file = File::create(file_path)?;
    file.write_all(values.as_bytes())?;

    Ok(())
}

pub fn remove_quiz(quiz_name: &str) -> Result<(), std::io::Error> {
    let path = Path::new(QUIZES_FOLDER).join(format!("{}.txt", quiz_name));

    // Check if the file exists and remove it
    if path.exists() {
        fs::remove_file(path)?;
        println!("Quiz '{}' removed successfully.", quiz_name);
    } else {
        println!("Quiz '{}' does not exist.", quiz_name);
    }

    Ok(())
}

pub fn get_quizes() -> Result<Vec<(String, String)>, io::Error> {
    let path = Path::new(QUIZES_FOLDER);
    let mut quizes = Vec::new();

    // Ensure the "quizes" folder exists
    if !path.exists() {
        return Ok(quizes); // Return an empty vector if the folder does not exist
    }

    // Read the directory
    let entries = fs::read_dir(path)?;

    for entry in entries {
        let entry = entry?;
        let path = entry.path();

        // Skip if not a file
        if path.is_file() {
            let mut file = fs::File::open(&path)?;
            let mut content = String::new();
            file.read_to_string(&mut content)?;

            // Extract file name
            let file_name = entry
                .file_name()
                .into_string()
                .unwrap_or_default()
                .trim_end_matches(".txt")
                .to_string();

            // Add (file_name, content) tuple to the vector
            quizes.push((file_name, content));
        }
    }

    Ok(quizes)
}
