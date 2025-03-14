import React, { useState } from 'react';
import { open } from '@tauri-apps/api/dialog';
import { FaArrowLeft } from 'react-icons/fa';
import './ProjectForm.css';

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
    const [diagramType, setDiagramType] =
        useState<'programming' | 'creative' | 'other'>('programming');

    const handleSelectLocation = async () => {
        try {
            const selectedPath = await open({ directory: true });
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
        <div className="project-form-container">
            <div className="project-form-content">
                <button
                    onClick={onBack}
                    className="btn btn-custom mb-3"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <FaArrowLeft />
                    <span>Volver</span>
                </button>

                <h2 className="mb-4">Crear Nuevo Proyecto</h2>
                <form onSubmit={handleSubmit} className="text-start">
                    <div className="mb-3">
                        <label>Nombre del Proyecto:</label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                            className="form-control mt-1"
                        />
                    </div>

                    <div className="mb-3">
                        <label>Ubicación del Archivo:</label>
                        <div className="d-flex gap-2 mt-1">
                            <input
                                type="text"
                                value={filePath}
                                onChange={(e) => setFilePath(e.target.value)}
                                required
                                className="form-control"
                            />
                            <button type="button" onClick={handleSelectLocation} className="btn btn-custom">
                                Seleccionar
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>Tipo de Diagrama:</label>
                        <select
                            value={diagramType}
                            onChange={(e) =>
                                setDiagramType(e.target.value as 'programming' | 'creative' | 'other')
                            }
                            required
                            className="form-select mt-1"
                        >
                            <option value="programming">Diagrama de Flujo (Programación)</option>
                            <option value="creative">Diagrama Creativo</option>
                            <option value="other">Otro</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-custom mt-3 w-100">
                        Crear Proyecto
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProjectForm;
