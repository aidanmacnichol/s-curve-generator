import React from 'react';
import { StepperCurveResult } from '../types/StepperCurve';
import './ResultsDisplay.css';

interface ResultsDisplayProps {
    results: StepperCurveResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
    const downloadCSV = () => {
        const headers = ['Step', 'Delay (μs)', 'Time (s)', 'Velocity (steps/s)', 'Position (steps)', 'Acceleration'];
        const csvContent = [
            headers.join(','),
            ...results.step_numbers.map((step, index) =>
                [
                    step,
                    results.delays[index],
                    results.time_points[index],
                    results.velocity_profile[index],
                    results.position_profile[index],
                    results.acceleration_profile[index]
                ].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'stepper_curve_profile.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }; const formatTime = (time: number): string => {
        return time.toFixed(4);
    };

    const formatNumber = (num: number): string => {
        return num.toFixed(2);
    };

    return (
        <div className="results-display">
            <div className="results-header">
                <h2>S-Curve Results</h2>
                <button className="download-button" onClick={downloadCSV}>
                    📊 Download CSV
                </button>
            </div>

            <div className="results-grid">
                {/* Summary Statistics */}
                <div className="result-card summary-card">
                    <h3>Motion Summary</h3>
                    <div className="summary-stats">
                        <div className="stat">
                            <span className="stat-label">Total Steps:</span>
                            <span className="stat-value">{results.total_steps}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Total Time:</span>
                            <span className="stat-value">{formatTime(results.total_time)} s</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Max Velocity:</span>
                            <span className="stat-value">{formatNumber(Math.max(...results.velocity_profile))} steps/s</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Min Delay:</span>
                            <span className="stat-value">{results.min_delay} μs</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Max Delay:</span>
                            <span className="stat-value">{results.max_delay} μs</span>
                        </div>
                    </div>
                </div>

                {/* Phase Breakdown */}
                <div className="result-card phases-card">
                    <h3>Motion Configuration</h3>
                    <div className="phases-list">
                        <div className="phase">
                            <span className="phase-label">Acceleration Steps:</span>
                            <span className="phase-value">{results.acc_steps}</span>
                        </div>
                        <div className="phase">
                            <span className="phase-label">Constant Speed Steps:</span>
                            <span className="phase-value">{results.total_steps - results.acc_steps - results.dec_steps}</span>
                        </div>
                        <div className="phase">
                            <span className="phase-label">Deceleration Steps:</span>
                            <span className="phase-value">{results.dec_steps}</span>
                        </div>
                        <div className="phase">
                            <span className="phase-label">Speed Range:</span>
                            <span className="phase-value">{formatNumber(1000000 / results.max_delay)} - {formatNumber(1000000 / results.min_delay)} steps/s</span>
                        </div>
                    </div>
                </div>                {/* Chart Placeholders */}
                <div className="result-card chart-card">
                    <h3>Velocity Profile</h3>
                    <div className="chart-placeholder">
                        <svg viewBox="0 0 400 200" className="profile-chart">
                            <defs>
                                <linearGradient id="velocityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#3498db" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#3498db" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>

                            {/* Grid lines */}
                            <g stroke="#ecf0f1" strokeWidth="1">
                                {[0, 1, 2, 3, 4].map(i => (
                                    <line key={i} x1={i * 100} y1="0" x2={i * 100} y2="180" />
                                ))}
                                {[0, 1, 2, 3].map(i => (
                                    <line key={i} x1="0" y1={i * 45 + 10} x2="400" y2={i * 45 + 10} />
                                ))}
                            </g>

                            {/* Velocity curve approximation */}
                            <path
                                d="M 20,170 Q 60,120 100,80 Q 140,40 180,40 Q 220,40 260,80 Q 300,120 380,170"
                                stroke="#3498db"
                                strokeWidth="3"
                                fill="url(#velocityGradient)"
                            />

                            <text x="200" y="195" textAnchor="middle" className="chart-label">Time (s)</text>
                            <text x="10" y="100" textAnchor="middle" transform="rotate(-90 10 100)" className="chart-label">Velocity</text>
                        </svg>
                    </div>
                </div>

                <div className="result-card chart-card">
                    <h3>Position Profile</h3>
                    <div className="chart-placeholder">
                        <svg viewBox="0 0 400 200" className="profile-chart">
                            <defs>
                                <linearGradient id="positionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#27ae60" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#27ae60" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>

                            {/* Grid lines */}
                            <g stroke="#ecf0f1" strokeWidth="1">
                                {[0, 1, 2, 3, 4].map(i => (
                                    <line key={i} x1={i * 100} y1="0" x2={i * 100} y2="180" />
                                ))}
                                {[0, 1, 2, 3].map(i => (
                                    <line key={i} x1="0" y1={i * 45 + 10} x2="400" y2={i * 45 + 10} />
                                ))}
                            </g>

                            {/* Position curve (S-shaped) */}
                            <path
                                d="M 20,170 Q 80,160 140,120 Q 200,80 260,60 Q 320,40 380,30"
                                stroke="#27ae60"
                                strokeWidth="3"
                                fill="url(#positionGradient)"
                            />

                            <text x="200" y="195" textAnchor="middle" className="chart-label">Time (s)</text>
                            <text x="10" y="100" textAnchor="middle" transform="rotate(-90 10 100)" className="chart-label">Position</text>
                        </svg>
                    </div>
                </div>

                <div className="result-card chart-card">
                    <h3>Acceleration Profile</h3>
                    <div className="chart-placeholder">
                        <svg viewBox="0 0 400 200" className="profile-chart">
                            <defs>
                                <linearGradient id="accelerationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#e74c3c" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#e74c3c" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>

                            {/* Grid lines */}
                            <g stroke="#ecf0f1" strokeWidth="1">
                                {[0, 1, 2, 3, 4].map(i => (
                                    <line key={i} x1={i * 100} y1="0" x2={i * 100} y2="180" />
                                ))}
                                {[0, 1, 2, 3].map(i => (
                                    <line key={i} x1="0" y1={i * 45 + 10} x2="400" y2={i * 45 + 10} />
                                ))}
                            </g>

                            {/* Acceleration curve (trapezoidal with smooth edges) */}
                            <path
                                d="M 20,170 L 60,80 L 140,80 L 180,170 L 220,170 L 260,80 L 340,80 L 380,170"
                                stroke="#e74c3c"
                                strokeWidth="3"
                                fill="url(#accelerationGradient)"
                            />

                            <text x="200" y="195" textAnchor="middle" className="chart-label">Time (s)</text>
                            <text x="10" y="100" textAnchor="middle" transform="rotate(-90 10 100)" className="chart-label">Acceleration</text>
                        </svg>
                    </div>
                </div>

                {/* Data Table Sample */}
                <div className="result-card data-card">
                    <h3>Sample Data Points</h3>
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Step</th>
                                    <th>Delay (μs)</th>
                                    <th>Time (s)</th>
                                    <th>Velocity (steps/s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.step_numbers.slice(0, 10).map((step, index) => (
                                    <tr key={index}>
                                        <td>{step}</td>
                                        <td>{formatNumber(results.delays[index])}</td>
                                        <td>{formatTime(results.time_points[index])}</td>
                                        <td>{formatNumber(results.velocity_profile[index])}</td>
                                    </tr>
                                ))}
                                {results.step_numbers.length > 10 && (
                                    <tr>
                                        <td colSpan={4} className="more-data">
                                            ... and {results.step_numbers.length - 10} more data points
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;
