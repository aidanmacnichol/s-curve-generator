export interface StepperCurveParameters {
    total_steps: number;    // Total number of steps to take
    acc_steps: number;      // Number of steps for acceleration
    dec_steps: number;      // Number of steps for deceleration  
    min_delay: number;      // Minimum delay between steps (microseconds)
    max_delay: number;      // Maximum delay between steps (microseconds)
}

export interface StepperCurveResult {
    step_numbers: number[];        // Step index [0, 1, 2, ...]
    delays: number[];              // Delay for each step (microseconds)
    time_points: number[];         // Cumulative time at each step
    velocity_profile: number[];    // Velocity at each step (steps/sec)
    position_profile: number[];    // Position at each step (step number)
    acceleration_profile: number[]; // Acceleration at each step
    total_steps: number;           // Total number of steps
    total_time: number;            // Total time for motion
    min_delay: number;             // Minimum delay used
    max_delay: number;             // Maximum delay used
    acc_steps: number;             // Acceleration steps used
    dec_steps: number;             // Deceleration steps used
}
