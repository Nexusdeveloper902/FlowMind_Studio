import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { listen } from '@tauri-apps/api/event';
import Home from './Home';
import ProjectForm from './ProjectForm';
import DiagramEditor from './DiagramEditor';

function App() {
    const [projectData, setProjectData] = useState<any>(null);
    const [creationResult, setCreationResult] = useState<string | null>(null);
    const [view, setView] = useState<'home' | 'form' | 'editor'>('home');

    // Inicia un proyecto nuevo (lleva al formulario)
    const handleNewProject = () => {
        setView('form');
    };

    // Cargar proyecto existente mediante diálogo
    const handleLoadProject = async () => {
        try {
            const selectedPath = await open({
                filters: [{ name: 'JSON', extensions: ['json'] }],
                multiple: false,
            });
            if (selectedPath && typeof selectedPath === 'string') {
                await handleAutoLoad(selectedPath);
            }
        } catch (error) {
            console.error('Error al cargar proyecto:', error);
        }
    };

    // Carga automática (para file association o botón de cargar)
    const handleAutoLoad = async (filePath: string) => {
        try {
            const jsonStr = await invoke<string>('load_project', { path: filePath });
            const loadedProject = JSON.parse(jsonStr);
            // Cuando se carga un proyecto existente, marcamos isNew como false
            setProjectData({ ...loadedProject, isNew: false });
            setCreationResult(filePath);
            setView('editor');
        } catch (error) {
            console.error('Error al cargar proyecto automáticamente:', error);
        }
    };

    // Retroceder a la pantalla principal
    const handleBack = () => {
        setProjectData(null);
        setCreationResult(null);
        setView('home');
    };

    // Al crear un proyecto nuevo, se invoca create_project y se marca isNew true
    const handleCreateProject = async ({
                                           projectName,
                                           filePath,
                                           selectedOption,
                                       }: {
        projectName: string;
        filePath: string;
        selectedOption: string | null;
    }) => {
        try {
            if (!selectedOption) {
                alert('Por favor, selecciona un tipo de diagrama');
                return;
            }
            console.log('Creating project with:', {
                name: projectName,
                path: filePath,
                diagramType: selectedOption, // clave en snake_case
            });
            const resultPath = await invoke<string>('create_project', {
                name: projectName,
                path: filePath,
                diagramType: selectedOption,
            });
            // Marcamos que es un proyecto nuevo
            setProjectData({ projectName, filePath, selectedOption, isNew: true });
            setCreationResult(resultPath);
            setView('editor');
        } catch (error) {
            console.error('Error al crear el proyecto:', error);
            alert(`Error: ${error}`);
        }
    };

    // Escucha del evento para abrir archivos (file association)
    useEffect(() => {
        const unlistenPromise = listen('tauri://open-file', (event) => {
            const filePath = event.payload as string;
            if (filePath) {
                handleAutoLoad(filePath);
            }
        });
        return () => {
            unlistenPromise.then((unlisten) => unlisten());
        };
    }, []);

    return (
        <div>
            {view === 'home' && (
                <Home onNewProject={handleNewProject} onLoadProject={handleLoadProject} />
            )}
            {view === 'form' && (
                <ProjectForm onBack={handleBack} onCreate={handleCreateProject} />
            )}
            {view === 'editor' && (
                <DiagramEditor
                    projectPath={creationResult}
                    isNew={!!projectData?.isNew}
                    onBackToProject={() => setView('home')}
                />
            )}
        </div>
    );
}

export default App;
