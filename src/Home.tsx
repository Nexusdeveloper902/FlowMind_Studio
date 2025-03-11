import React from 'react';

const Home = ({ onNewProject, onLoadProject }) => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>FlowMind Studio</h1>
            <p>Seleccione una opción:</p>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginTop: '1rem'
                }}
            >
                <button
                    style={{
                        padding: '0.8rem 1.2rem',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                    onClick={onNewProject}
                >
                    Nuevo Proyecto
                </button>
                <button
                    style={{
                        padding: '0.8rem 1.2rem',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                    onClick={onLoadProject}
                >
                    Cargar Proyecto
                </button>
            </div>
        </div>
    );
};

export default Home;
