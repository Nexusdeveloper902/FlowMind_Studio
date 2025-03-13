
import { FaLightbulb } from 'react-icons/fa';
import './index.css'; // Tus estilos globales

const Navbar = () => {
    return (
        <nav className="navbar navbar-custom fixed-top py-3">
            <div className="container-fluid d-flex justify-content-between align-items-center">

                {/* Sección Izquierda: Ícono + Texto */}
                <div className="d-flex align-items-center gap-2">
                    <FaLightbulb size="1.5em" />
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            FlowMind Studio
          </span>
                </div>

                {/* Sección Derecha: Enlaces / Botones */}
                <div>
                    <a className="nav-link d-inline-block me-3" href="#">
                        Inicio
                    </a>
                    <a className="nav-link d-inline-block" href="#">
                        Editor
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
