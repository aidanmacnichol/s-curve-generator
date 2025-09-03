import React from 'react';
import { StepperCurveResult } from '../types/StepperCurve';
import './ResultsDisplay.css';

interface ResultsDisplayProps {
    results: StepperCurveResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
    const downloadCSV = () => {
        const headers = ['Time (s)', 'Velocity (steps/s)', 'Position (steps)', 'Acceleration (steps/s²)'];
        const csvContent = [
            headers.join(','),
            ...results.time_points.map((time, index) =>
                [
                    time,
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
    };

    const formatTime = (time: number): string => {
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
                            <span className="stat-label">Total Time:</span>
                            <span className="stat-value">{formatTime(results.total_time)} s</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Peak Velocity:</span>
                            <span className="stat-value">{formatNumber(results.peak_velocity)} steps/s</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Data Points:</span>
                            <span className="stat-value">{results.time_points.length}</span>
                        </div>
                    </div>
                </div>

                {/* Phase Breakdown */}
                <div className="result-card phases-card">
                    <h3>Motion Phases</h3>
                    <div className="phases-list">
                        <div className="phase">
                            <span className="phase-label">Acceleration Buildup:</span>
                            <span className="phase-value">{formatTime(results.phases.t1)} s</span>
                        </div>
                        <div className="phase">
                            <span className="phase-label">Constant Acceleration:</span>
                            <span className="phase-value">{formatTime(results.phases.t2)} s</span>
                        </div>
                        <div className="phase">
                            <span className="phase-label">Acceleration Decay:</span>
                            <span className="phase-value">{formatTime(results.phases.t3)} s</span>
                        </div>
                        <div className="phase">
                            <span className="phase-label">Constant Velocity:</span>
                            <span className="phase-value">{formatTime(results.phases.t4)} s</span>
                        </div>
                        <div className="phase">
                            <span className="phase-label">Deceleration Buildup:</span>
                            <span className="phase-value">{formatTime(results.phases.t5)} s</span>
                        </div>
                        <div className="phase">
                            <span className="phase-label">Constant Deceleration:</span>
                            <span className="phase-value">{formatTime(results.phases.t6)} s</span>
                        </div>
                        <div className="phase">
                            <span className="phase-label">Deceleration Decay:</span>
                            <span className="phase-value">{formatTime(results.phases.t7)} s</span>
                        </div>
                    </div>
                </div>

                {/* Chart Placeholders */}
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
                                    <th>Time (s)</th>
                                    <th>Velocity</th>
                                    <th>Position</th>
                                    <th>Acceleration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.time_points.slice(0, 10).map((time, index) => (
                                    <tr key={index}>
                                        <td>{formatTime(time)}</td>
                                        <td>{formatNumber(results.velocity_profile[index])}</td>
                                        <td>{formatNumber(results.position_profile[index])}</td>
                                        <td>{formatNumber(results.acceleration_profile[index])}</td>
                                    </tr>
                                ))}
                                {results.time_points.length > 10 && (
                                    <tr>
                                        <td colSpan={4} className="more-data">
                                            ... and {results.time_points.length - 10} more data points
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
