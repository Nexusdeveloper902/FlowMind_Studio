import React from 'react';

interface HomeProps {
    onNewProject: () => void;
    onLoadProject: () => void;
}

const Home: React.FC<HomeProps> = ({ onNewProject, onLoadProject }) => {
    return (
        <div className="text-center p-4">
            <h1>FlowMind Studio</h1>
            <p>Seleccione una opción:</p>
            <div className="d-flex justify-content-center gap-3 mt-3">
                <button className="btn btn-custom" onClick={onNewProject}>Nuevo Proyecto</button>
                <button className="btn btn-custom" onClick={onLoadProject}>Cargar Proyecto</button>
            </div>
        </div>
    );
};

export default Home;
