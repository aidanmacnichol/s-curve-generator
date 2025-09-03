import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Stepper Motor S-Curve Acceleration Calculator</h1>
                    <p className="hero-subtitle">
                        Calculate smooth acceleration profiles for stepper motors using S-curve motion planning
                    </p>
                    <Link to="/calculator" className="cta-button">
                        Get Started
                    </Link>
                </div>
            </section>

            <section className="info-section">
                <div className="container">
                    <h2>Understanding S-Curve Acceleration</h2>
                    <div className="info-grid">
                        <div className="info-card">
                            <h3>What is S-Curve Motion?</h3>
                            <p>
                                S-curve motion profiles provide smooth acceleration and deceleration by limiting jerk
                                (the rate of change of acceleration). This results in smoother operation, reduced
                                vibration, and improved accuracy for stepper motor systems.
                            </p>
                        </div>

                        <div className="info-card">
                            <h3>Benefits</h3>
                            <ul>
                                <li>Reduced mechanical stress and vibration</li>
                                <li>Improved positioning accuracy</li>
                                <li>Smoother motion with less noise</li>
                                <li>Extended equipment lifespan</li>
                                <li>Better performance at high speeds</li>
                            </ul>
                        </div>

                        <div className="info-card">
                            <h3>Applications</h3>
                            <ul>
                                <li>CNC machines and 3D printers</li>
                                <li>Pick and place systems</li>
                                <li>Conveyor belt control</li>
                                <li>Robotic positioning systems</li>
                                <li>Precision manufacturing equipment</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="comparison-section">
                <div className="container">
                    <h2>Acceleration Profile Comparison</h2>
                    <p className="section-subtitle">
                        Compare different acceleration profiles to understand the advantages of S-curve motion
                    </p>

                    <div className="comparison-grid">
                        <div className="comparison-card">
                            <h3>Linear Acceleration</h3>
                            <div className="profile-placeholder">
                                <svg viewBox="0 0 200 100" className="profile-svg">
                                    <path d="M 10,90 L 50,10 L 150,10 L 190,90" stroke="#e74c3c" strokeWidth="2" fill="none" />
                                    <text x="100" y="50" textAnchor="middle" className="profile-text">Velocity</text>
                                </svg>
                            </div>
                            <p>Traditional trapezoidal profile with instant acceleration changes causing vibration and stress.</p>
                        </div>

                        <div className="comparison-card highlighted">
                            <h3>S-Curve Acceleration</h3>
                            <div className="profile-placeholder">
                                <svg viewBox="0 0 200 100" className="profile-svg">
                                    <path d="M 10,90 Q 30,60 50,30 Q 70,10 100,10 Q 130,10 150,30 Q 170,60 190,90" stroke="#27ae60" strokeWidth="2" fill="none" />
                                    <text x="100" y="50" textAnchor="middle" className="profile-text">Velocity</text>
                                </svg>
                            </div>
                            <p>Smooth S-curve profile with controlled jerk for optimal performance and reduced wear.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <h2>Calculator Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>🎯 Precise Calculations</h3>
                            <p>Calculate exact motion profiles based on your motor specifications and requirements</p>
                        </div>

                        <div className="feature-card">
                            <h3>📊 Visual Graphs</h3>
                            <p>See real-time graphs of velocity, acceleration, and position profiles</p>
                        </div>

                        <div className="feature-card">
                            <h3>⚙️ Customizable Parameters</h3>
                            <p>Adjust maximum velocity, acceleration, jerk, and distance parameters</p>
                        </div>

                        <div className="feature-card">
                            <h3>📱 Responsive Design</h3>
                            <p>Works on desktop, tablet, and mobile devices for calculations on the go</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Calculate Your S-Curve Profile?</h2>
                    <p>Input your stepper motor parameters and get instant results</p>
                    <Link to="/calculator" className="cta-button large">
                        Open Calculator
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
