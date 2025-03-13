import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { listen } from '@tauri-apps/api/event';
import Home from './Home';
import ProjectForm from './ProjectForm';
import DiagramEditor from './DiagramEditor';
import Layout from './Layout';

interface ProjectData {
    projectName?: string;
    filePath?: string;
    selectedOption?: 'programming' | 'creative' | 'other';
    isNew?: boolean;
    mode?: 'programming' | 'creative';
    nodes?: any[];
    edges?: any[];
    diagram_type?: 'programming' | 'creative' | 'other';
    name?: string;
    path?: string;
}

function App() {
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const [creationResult, setCreationResult] = useState<string | null>(null);
    const [view, setView] = useState<'home' | 'form' | 'editor'>('home');

    const handleNewProject = () => {
        setView('form');
    };

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

    const handleAutoLoad = async (filePath: string) => {
        try {
            const jsonStr = await invoke<string>('load_project', { path: filePath });
            const loadedProject = JSON.parse(jsonStr) as ProjectData;

            if (loadedProject.nodes && loadedProject.edges) {
                if (!loadedProject.mode) {
                    loadedProject.mode = loadedProject.diagram_type as 'programming' | 'creative' || 'programming';
                }
                loadedProject.selectedOption = loadedProject.mode;
            } else {
                if (!loadedProject.selectedOption && loadedProject.diagram_type) {
                    loadedProject.selectedOption = loadedProject.diagram_type;
                }
            }

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

    const handleCreateProject = async ({
                                           projectName,
                                           filePath,
                                           selectedOption,
                                       }: {
        projectName: string;
        filePath: string;
        selectedOption: 'programming' | 'creative' | 'other';
    }) => {
        try {
            const resultPath = await invoke<string>('create_project', {
                name: projectName,
                path: filePath,
                diagramType: selectedOption,
            });
            setProjectData({ projectName, filePath, selectedOption, isNew: true, diagram_type: selectedOption });
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

    let content;
    if (view === 'home') {
        content = <Home onNewProject={handleNewProject} onLoadProject={handleLoadProject} />;
    } else if (view === 'form') {
        content = <ProjectForm onBack={handleBack} onCreate={handleCreateProject} />;
    } else if (view === 'editor' && projectData) {
        content = (
            <DiagramEditor
                projectPath={creationResult}
                isNew={!!projectData?.isNew}
                onBackToProject={() => setView('home')}
                mode={projectData.selectedOption as 'programming' | 'creative' || 'programming'}
            />
        );
    }

    return (
        <Layout>
            {content}
        </Layout>
    );
}

export default App;
