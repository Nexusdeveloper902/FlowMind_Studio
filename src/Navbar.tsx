// Navbar.tsx
import { FaLightbulb } from 'react-icons/fa';
import './index.css';

const Navbar = () => {
    return (
        <nav className="navbar navbar-custom py-3">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <FaLightbulb size="1.5em" />
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            FlowMind Studio
          </span>
                </div>
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
