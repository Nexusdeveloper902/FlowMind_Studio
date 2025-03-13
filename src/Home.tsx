// Home.tsx
import React from 'react';
import { FaPlusCircle, FaFolderOpen } from 'react-icons/fa';
import './Home.css';

interface HomeProps {
    onNewProject: () => void;
    onLoadProject: () => void;
}

const Home: React.FC<HomeProps> = ({ onNewProject, onLoadProject }) => {
    return (
        <div className="home-hero d-flex flex-column align-items-center justify-content-center text-center">
            <h1 className="display-4">FlowMind Studio</h1>
            <p className="lead">
                Organiza tus ideas y crea diagramas de flujo o mapas mentales de forma sencilla.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
                <button className="btn btn-custom" onClick={onNewProject}>
                    <FaPlusCircle className="me-2" />
                    Nuevo Proyecto
                </button>
                <button className="btn btn-custom" onClick={onLoadProject}>
                    <FaFolderOpen className="me-2" />
                    Cargar Proyecto
                </button>
            </div>
        </div>
    );
};

export default Home;
