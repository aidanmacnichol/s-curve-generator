export interface StepperCurveParameters {
    total_steps: number;      // Maximum velocity (steps/sec)
    acc_steps: number;      // Acceleration (steps/sec²)
    dec_steps: number;    // Jerk (steps/sec³)
    min_delay: number;   // Total distance to travel (steps)
    max_delay: number;  // Time resolution for calculation (optional)
}

export interface StepperCurvePhases {
    t1: number; // Acceleration buildup time
    t2: number; // Constant acceleration time
    t3: number; // Acceleration decay time
    t4: number; // Constant velocity time
    t5: number; // Deceleration buildup time
    t6: number; // Constant deceleration time
    t7: number; // Deceleration decay time
}

export interface StepperCurveResult {
    time_points: number[];
    velocity_profile: number[];
    position_profile: number[];
    acceleration_profile: number[];
    phases: StepperCurvePhases;
    total_time: number;
    peak_velocity: number;
}
