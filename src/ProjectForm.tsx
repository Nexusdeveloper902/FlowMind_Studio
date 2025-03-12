import React, { useState } from 'react';
import { open } from '@tauri-apps/api/dialog';

interface ProjectFormProps {
    onBack: () => void;
    onCreate: (data: {
        projectName: string;
        filePath: string;
        selectedOption: 'programming' | 'creative' | 'other';
    }) => void;
}

function ProjectForm({ onBack, onCreate }: ProjectFormProps) {
    const [projectName, setProjectName] = useState('');
    const [filePath, setFilePath] = useState('');
    const [diagramType, setDiagramType] = useState<'programming' | 'creative' | 'other'>('programming');

    // Abre el diálogo para seleccionar la ubicación
    const handleSelectLocation = async () => {
        try {
            const selectedPath = await open({
                directory: true,
            });
            if (selectedPath && typeof selectedPath === 'string') {
                setFilePath(selectedPath);
            }
        } catch (error) {
            console.error('Error al seleccionar la ubicación:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate({ projectName, filePath, selectedOption: diagramType });
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1rem' }}>
                &larr; Volver
            </button>
            <h2>Crear Nuevo Proyecto</h2>
            <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Nombre del Proyecto:</label><br />
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Ubicación del Archivo:</label><br />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={filePath}
                            onChange={(e) => setFilePath(e.target.value)}
                            required
                        />
                        <button type="button" onClick={handleSelectLocation}>
                            Seleccionar
                        </button>
                    </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Tipo de Diagrama:</label><br />
                    <select
                        value={diagramType}
                        onChange={(e) => setDiagramType(e.target.value as 'programming' | 'creative' | 'other')}
                        required
                    >
                        <option value="programming">Diagrama de Flujo (Programación)</option>
                        <option value="creative">Diagrama Creativo</option>
                        <option value="other">Otro</option>
                    </select>
                </div>
                <button type="submit" style={{ marginTop: '1rem' }}>
                    Crear Proyecto
                </button>
            </form>
        </div>
    );
}

export default ProjectForm;