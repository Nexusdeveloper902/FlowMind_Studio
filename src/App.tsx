// src/App.tsx
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { listen } from '@tauri-apps/api/event';
import Home from './Home';
import ProjectForm from './ProjectForm';
import DiagramEditor from './DiagramEditor';

interface ProjectData {
    projectName?: string;
    filePath?: string;
    selectedOption?: string | null;
    isNew?: boolean;
}

function App() {
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const [creationResult, setCreationResult] = useState<string | null>(null);
    const [view, setView] = useState<'home' | 'form' | 'editor'>('home');

    // Inicia un proyecto nuevo
    const handleNewProject = () => {
        setView('form');
    };

    // Cargar un proyecto existente
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

    // Carga automática de proyectos
    const handleAutoLoad = async (filePath: string) => {
        try {
            const jsonStr = await invoke<string>('load_project', { path: filePath });
            const loadedProject = JSON.parse(jsonStr);
            setProjectData({ ...loadedProject, isNew: false });
            setCreationResult(filePath);
            setView('editor');
        } catch (error) {
            console.error('Error al cargar proyecto automáticamente:', error);
        }
    };

    const handleBack = () => {
        setProjectData(null);
        setCreationResult(null);
        setView('home');
    };

    // Crear un nuevo proyecto
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
            const resultPath = await invoke<string>('create_project', {
                name: projectName,
                path: filePath,
                diagram_type: selectedOption,
            });
            setProjectData({ projectName, filePath, selectedOption, isNew: true });
            setCreationResult(resultPath);
            setView('editor');
        } catch (error) {
            console.error('Error al crear el proyecto:', error);
            alert(`Error: ${error}`);
        }
    };

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
