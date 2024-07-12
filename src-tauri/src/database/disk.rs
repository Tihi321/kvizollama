use std::env;
use std::fs::{self, File};
use std::io::Write;
use std::io::{self, Read};
use std::path::{Path, PathBuf};
use std::result::Result;

use super::constants::{QUIZES_FOLDER, SERVER_FOLDER};
use super::structs::Topics;

fn get_quizes_folder_path() -> PathBuf {
    let current_dir = env::current_dir().expect("Failed to get current directory");
    let quizes_folder_path = current_dir.join(QUIZES_FOLDER);

    if !quizes_folder_path.exists() {
        fs::create_dir_all(&quizes_folder_path).unwrap();
        println!("Folder 'quizes' created successfully.");
    }

    return quizes_folder_path;
}

fn get_server_folder_path() -> PathBuf {
    let current_dir = env::current_dir().expect("Failed to get current directory");
    let quizes_folder_path = current_dir.join(SERVER_FOLDER);

    if !quizes_folder_path.exists() {
        fs::create_dir_all(&quizes_folder_path).unwrap();
        println!("Folder 'quizes' created successfully.");
    }

    return quizes_folder_path;
}

pub fn get_quiz_path(quiz_name: &str) -> Result<String, io::Error> {
    let quizes_folder_path = get_quizes_folder_path();
    let path = quizes_folder_path.join(format!("{}.json", quiz_name));

    if path.exists() {
        Ok(path.to_str().unwrap().to_string())
    } else {
        Err(io::Error::new(
            io::ErrorKind::NotFound,
            "Quiz does not exist.",
        ))
    }
}

pub fn add_quiz(quiz_name: &str, quiz_info: Vec<Topics>) -> io::Result<()> {
    // Check for invalid characters in quiz_name
    if quiz_name.contains('/') || quiz_name.contains('\\') {
        return Err(io::Error::new(
            io::ErrorKind::InvalidInput,
            "Invalid quiz name.",
        ));
    }

    let quizes_folder_path = get_quizes_folder_path();
    let file_path = quizes_folder_path.join(format!("{}.json", quiz_name));

    // Check if the quiz file already exists
    if file_path.exists() {
        return Err(io::Error::new(
            io::ErrorKind::AlreadyExists,
            "Quiz already exists.",
        ));
    }

    // Serialize quiz_info
    let serialized = serde_json::to_string(&quiz_info)?;
    let mut file = File::create(file_path)?;
    file.write_all(serialized.as_bytes())?;

    Ok(())
}

pub fn add_server_quiz(quiz_path: String) -> io::Result<()> {
    let quizes_folder_path = get_server_folder_path();
    let file_path = quizes_folder_path.join(Path::new(&quiz_path).file_name().unwrap());

    // Check if the quiz file already exists
    if file_path.exists() {
        return Err(io::Error::new(
            io::ErrorKind::AlreadyExists,
            "Quiz already exists.",
        ));
    }

    // Copy the file to the server folder
    fs::copy(&quiz_path, &file_path)?;

    Ok(())
}

pub fn remove_quiz(quiz_name: &str) -> Result<(), std::io::Error> {
    let quizes_folder_path = get_quizes_folder_path();
    let path = quizes_folder_path.join(format!("{}.json", quiz_name));

    // Check if the file exists and remove it
    if path.exists() {
        fs::remove_file(path)?;
        println!("Quiz {} removed successfully.", quiz_name);
    } else {
        println!("Quiz {} does not exist.", quiz_name);
    }

    Ok(())
}

pub fn remove_server_quiz(quiz_name: &str) -> Result<(), std::io::Error> {
    let quizes_folder_path = get_server_folder_path();
    let path = quizes_folder_path.join(format!("{}.json", quiz_name));

    // Check if the file exists and remove it
    if path.exists() {
        fs::remove_file(path)?;
        println!("Quiz {} removed successfully.", quiz_name);
    } else {
        println!("Quiz {} does not exist.", quiz_name);
    }

    Ok(())
}

pub fn import_quizes(paths: Vec<String>) -> Result<(), io::Error> {
    let quizes_folder_path = get_quizes_folder_path();

    for path_str in paths {
        let path = Path::new(&path_str);
        if let Some(file_name) = path.file_name() {
            let destination_path = quizes_folder_path.join(file_name);

            if !destination_path.exists() {
                fs::copy(&path, &destination_path)?;
                println!("File {:?} copied to {:?}", path, destination_path);
            } else {
                println!(
                    "File {:?} already exists in {:?}",
                    file_name, quizes_folder_path
                );
            }
        }
    }

    Ok(())
}

pub fn get_quizes() -> Result<Vec<(String, String)>, io::Error> {
    let path = get_quizes_folder_path();
    let mut quizes = Vec::new();

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
                .trim_end_matches(".json")
                .to_string();

            // Add (file_name, content) tuple to the vector
            quizes.push((file_name, content));
        }
    }

    Ok(quizes)
}

pub fn get_server_quizes() -> Result<Vec<(String, String)>, io::Error> {
    let path = get_server_folder_path();
    let mut quizes = Vec::new();

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
                .trim_end_matches(".json")
                .to_string();

            // Add (file_name, content) tuple to the vector
            quizes.push((file_name, content));
        }
    }

    Ok(quizes)
}

pub fn get_server_quizes_response() -> Result<String, io::Error> {
    let path = get_server_folder_path();
    let mut quizes: String = "".to_string();

    quizes.push_str("[");

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

            // Add (file_name, content) tuple to the vector
            let file_name = entry
                .file_name()
                .into_string()
                .unwrap_or_default()
                .trim_end_matches(".json")
                .to_string();

            let output = format!("{{\"name\":\"{}\",\"content\":{}}},", file_name, content);
            quizes.push_str(output.as_str());
        }
    }

    quizes.push_str("]");

    Ok(quizes)
}
