import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    Stepper Motor S-Curve Calculator
                </Link>
                <div className="nav-menu">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/calculator"
                        className={`nav-link ${location.pathname === '/calculator' ? 'active' : ''}`}
                    >
                        Calculator
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
