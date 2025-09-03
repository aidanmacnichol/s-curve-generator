import React, { useState } from 'react';
import { StepperCurveParameters } from '../types/StepperCurve';
import './ParameterForm.css';

interface ParameterFormProps {
    onCalculate: (parameters: StepperCurveParameters) => void;
    loading: boolean;
}

const ParameterForm: React.FC<ParameterFormProps> = ({ onCalculate, loading }) => {
    const [parameters, setParameters] = useState<StepperCurveParameters>({
        total_steps: 100,
        acc_steps: 20,
        dec_steps: 20,
        min_delay: 500,      // 500 microseconds (fast)
        max_delay: 5000      // 5000 microseconds (slow)
    }); const [errors, setErrors] = useState<Partial<Record<keyof StepperCurveParameters, string>>>({});

    const handleInputChange = (field: keyof StepperCurveParameters, value: string) => {
        const numValue = parseFloat(value);
        setParameters(prev => ({
            ...prev,
            [field]: isNaN(numValue) ? 0 : numValue
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const validateParameters = (): boolean => {
        const newErrors: Partial<Record<keyof StepperCurveParameters, string>> = {};

        if (parameters.total_steps <= 0) {
            newErrors.total_steps = 'Total steps must be greater than 0';
        }

        if (parameters.acc_steps <= 0) {
            newErrors.acc_steps = 'Acceleration steps must be greater than 0';
        }

        if (parameters.dec_steps <= 0) {
            newErrors.dec_steps = 'Deceleration steps must be greater than 0';
        }

        if (parameters.acc_steps + parameters.dec_steps > parameters.total_steps) {
            newErrors.acc_steps = 'Acceleration + deceleration steps cannot exceed total steps';
            newErrors.dec_steps = 'Acceleration + deceleration steps cannot exceed total steps';
        }

        if (parameters.min_delay <= 0) {
            newErrors.min_delay = 'Minimum delay must be greater than 0';
        }

        if (parameters.max_delay <= 0) {
            newErrors.max_delay = 'Maximum delay must be greater than 0';
        }

        if (parameters.min_delay >= parameters.max_delay) {
            newErrors.min_delay = 'Minimum delay must be less than maximum delay';
            newErrors.max_delay = 'Maximum delay must be greater than minimum delay';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }; const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateParameters()) {
            onCalculate(parameters);
        }
    };

    const resetToDefaults = () => {
        setParameters({
            total_steps: 100,
            acc_steps: 20,
            dec_steps: 20,
            min_delay: 500,
            max_delay: 5000
        });
        setErrors({});
    }; return (
        <div className="parameter-form">
            <h2>Motion Parameters</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="total_steps">
                        Total Steps
                        <span className="required">*</span>
                    </label>
                    <input
                        type="number"
                        id="total_steps"
                        value={parameters.total_steps}
                        onChange={(e) => handleInputChange('total_steps', e.target.value)}
                        min="1"
                        step="1"
                        required
                        className={errors.total_steps ? 'error' : ''}
                    />
                    {errors.total_steps && <span className="error-text">{errors.total_steps}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="acc_steps">
                        Acceleration Steps
                        <span className="required">*</span>
                    </label>
                    <input
                        type="number"
                        id="acc_steps"
                        value={parameters.acc_steps}
                        onChange={(e) => handleInputChange('acc_steps', e.target.value)}
                        min="1"
                        step="1"
                        required
                        className={errors.acc_steps ? 'error' : ''}
                    />
                    {errors.acc_steps && <span className="error-text">{errors.acc_steps}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="dec_steps">
                        Deceleration Steps
                        <span className="required">*</span>
                    </label>
                    <input
                        type="number"
                        id="dec_steps"
                        value={parameters.dec_steps}
                        onChange={(e) => handleInputChange('dec_steps', e.target.value)}
                        min="1"
                        step="1"
                        required
                        className={errors.dec_steps ? 'error' : ''}
                    />
                    {errors.dec_steps && <span className="error-text">{errors.dec_steps}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="min_delay">
                        Min Delay (microseconds)
                        <span className="required">*</span>
                    </label>
                    <input
                        type="number"
                        id="min_delay"
                        value={parameters.min_delay}
                        onChange={(e) => handleInputChange('min_delay', e.target.value)}
                        min="1"
                        step="1"
                        required
                        className={errors.min_delay ? 'error' : ''}
                    />
                    {errors.min_delay && <span className="error-text">{errors.min_delay}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="max_delay">
                        Max Delay (microseconds)
                        <span className="required">*</span>
                    </label>
                    <input
                        type="number"
                        id="max_delay"
                        value={parameters.max_delay}
                        onChange={(e) => handleInputChange('max_delay', e.target.value)}
                        min="1"
                        step="1"
                        required
                        className={errors.max_delay ? 'error' : ''}
                    />
                    {errors.max_delay && <span className="error-text">{errors.max_delay}</span>}
                    <small className="help-text">Higher delay = slower speed. Min delay should be less than max delay.</small>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="calculate-button"
                        disabled={loading}
                    >
                        {loading ? 'Calculating...' : 'Calculate S-Curve'}
                    </button>

                    <button
                        type="button"
                        className="reset-button"
                        onClick={resetToDefaults}
                        disabled={loading}
                    >
                        Reset to Defaults
                    </button>
                </div>
            </form>

            <div className="preset-examples">
                <h3>Example Presets</h3>
                <div className="preset-buttons">
                    <button
                        className="preset-button"
                        onClick={() => setParameters({
                            total_steps: 50,
                            acc_steps: 10,
                            dec_steps: 10,
                            min_delay: 1000,
                            max_delay: 10000
                        })}
                        disabled={loading}
                    >
                        Slow & Smooth
                    </button>

                    <button
                        className="preset-button"
                        onClick={() => setParameters({
                            total_steps: 200,
                            acc_steps: 50,
                            dec_steps: 50,
                            min_delay: 300,
                            max_delay: 3000
                        })}
                        disabled={loading}
                    >
                        Fast Motion
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParameterForm;
