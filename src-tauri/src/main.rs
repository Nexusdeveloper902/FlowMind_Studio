#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::{create_dir_all, File, read_to_string, write};
use std::io::Write;
use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Serialize, Deserialize)]
struct ProjectData {
    name: String,
    path: String,
    diagram_type: String,
}

#[tauri::command]
fn create_project(name: &str, path: &str, diagramType: &str) -> Result<String, String> {
    // Crear la carpeta si no existe
    if let Err(e) = create_dir_all(path) {
        return Err(format!("Error al crear carpeta: {}", e));
    }
    // Solo se guardan metadatos en la creación
    let project_data = ProjectData {
        name: name.to_string(),
        path: path.to_string(),
        diagram_type: diagramType.to_string(),
    };

    let file_name = format!("{}.json", name);
    let json_path = format!("{}/{}", path, file_name);

    match File::create(&json_path) {
        Ok(mut file) => {
            let json_content = serde_json::to_string_pretty(&project_data)
                .map_err(|e| format!("Error al serializar JSON: {}", e))?;
            if let Err(e) = file.write_all(json_content.as_bytes()) {
                return Err(format!("Error al escribir en archivo: {}", e));
            }
        }
        Err(e) => {
            return Err(format!("Error al crear archivo: {}", e));
        }
    }
    Ok(json_path)
}

#[tauri::command]
fn load_project(path: &str) -> Result<String, String> {
    read_to_string(path).map_err(|e| format!("Error al leer archivo: {}", e))
}

#[tauri::command]
fn save_project(path: &str, data: &str) -> Result<(), String> {
    write(path, data).map_err(|e| format!("Error al guardar archivo: {}", e))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_project,
            load_project,
            save_project
        ])
        .run(tauri::generate_context!())
        .expect("Error al ejecutar la aplicación Tauri");
}
