import React, { useState } from 'react';
import { StepperCurveParameters, StepperCurveResult } from '../types/StepperCurve';
import ParameterForm from '../components/ParameterForm';
import ResultsDisplay from '../components/ResultsDisplay';
import './CalculatorPage.css';

const CalculatorPage: React.FC = () => {
    const [results, setResults] = useState<StepperCurveResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = async (parameters: StepperCurveParameters) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/api/v1/stepper_curves/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stepper_curve: parameters
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setResults(data.data);
            } else {
                throw new Error(data.error || 'Calculation failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Calculation error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="calculator-page">
            <div className="calculator-container">
                <header className="calculator-header">
                    <h1>S-Curve Calculator</h1>
                    <p>Enter your stepper motor parameters to calculate the optimal S-curve acceleration profile</p>
                </header>

                <div className="calculator-content">
                    <div className="calculator-sidebar">
                        <ParameterForm
                            onCalculate={handleCalculate}
                            loading={loading}
                        />
                    </div>

                    <div className="calculator-main">
                        {error && (
                            <div className="error-message">
                                <h3>Error</h3>
                                <p>{error}</p>
                            </div>
                        )}

                        {loading && (
                            <div className="loading-message">
                                <div className="spinner"></div>
                                <p>Calculating S-curve profile...</p>
                            </div>
                        )}

                        {results && !loading && (
                            <ResultsDisplay results={results} />
                        )}

                        {!results && !loading && !error && (
                            <div className="placeholder-message">
                                <h3>Ready to Calculate</h3>
                                <p>Fill in the parameters on the left and click "Calculate S-Curve" to see your results here.</p>

                                <div className="parameter-info">
                                    <h4>Parameter Guide:</h4>
                                    <ul>
                                        <li><strong>Total Steps:</strong> Total Steps (50, 100 or 150)</li>
                                        <li><strong>Acceleration Steps:</strong>Total number of steps during the acceleration phase</li>
                                        <li><strong>Deceleration Steps:</strong> Total number of steps during the deceleration phase</li>
                                        <li><strong>Min Delay:</strong>Minimum delay in milliseconds during the peak speed</li>
                                        <li><strong>Max Delay:</strong>Maximum delay in milliseconds during start of movement. *Note make sure it is below "fs" on datasheet*</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalculatorPage;
