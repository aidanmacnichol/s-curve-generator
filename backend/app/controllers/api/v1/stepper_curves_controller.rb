class Api::V1::StepperCurvesController < ApplicationController
  # POST /api/v1/stepper_curves/calculate
  def calculate
    begin
      # Extract parameters from request
      params_data = stepper_curve_params
      
      # Validate required parameters
      unless valid_parameters?(params_data)
        return render json: { error: 'Missing or invalid parameters' }, status: :bad_request
      end
      
      # Calculate S-curve acceleration profile
      result = calculate_s_curve(params_data)
      
      render json: {
        success: true,
        data: result,
        parameters: params_data
      }
    rescue StandardError => e
      render json: { 
        success: false, 
        error: e.message 
      }, status: :internal_server_error
    end
  end

  private

  def stepper_curve_params
    params.require(:stepper_curve).permit(
      :total_steps,          # Maximum velocity (steps/sec)
      :acc_steps,          # Acceleration (steps/sec²)
      :dec_steps,                  # Jerk (steps/sec³)
      :min_delay,        # Total distance to travel (steps)
      :max_delay        # Time resolution for calculation (optional)
    )
  end

  def valid_parameters?(params_data)
    required_params = [:total_steps, :acc_steps, :dec_steps, :min_delay, :max_delay]
    required_params.all? { |param| params_data[param].present? && params_data[param].to_f > 0 }
  end

  # Change to poly postfix
  def calculate_s_curve(params_data)
    # Extract parameters
    total_steps = params_data[:total_steps].to_f
    acc_steps = params_data[:acc_steps].to_f
    dec_steps = params_data[:dec_steps].to_f
    min_delay = params_data[:min_delay].to_f
    max_delay = params_data[:max_delay]&.to_f

    # Basic error checking
    if acc_steps <= 0 || acc_steps > total_steps / 2
      acc_steps = (total_steps / 2.0).round
    end 

    delays = Array.new(total_steps, 0.0)
    dec_start = total_steps - acc_steps

    # Generate cubic acceleration curve
    t = (0...acc_steps).map { |i| i.to_f / (acc_steps - 1)}

    # Acceleration & deceleration profiles
    cubic_acc = t.map { |val| (3 * val**2) - (2 * val**3) }
    cubic_dec = cubic_acc.reverse

    #########GO HERE################################

    # Calculate S-curve phases
    # Phase 1: Acceleration buildup (jerk limited)
    t1 = a_max / j_max
    v1 = 0.5 * j_max * t1**2
    s1 = (1.0/6.0) * j_max * t1**3

    # Phase 2: Constant acceleration
    # Check if we reach max velocity during acceleration phase
    v_peak_accel = v1 + a_max * t1  # Velocity at end of acceleration phase
    
    if v_peak_accel >= v_max
      # We reach max velocity, need to calculate modified profile
      # This is a simplified approach - in practice you'd solve the full equations
      t2 = (v_max - 2 * v1) / a_max
      t2 = [t2, 0].max  # Ensure non-negative
    else
      # Calculate time for constant acceleration to reach the velocity needed
      # for the given distance (simplified calculation)
      t2 = 0.1  # Placeholder - would need full kinematic solution
    end
    
    v2 = v1 + a_max * t2
    s2 = v1 * t2 + 0.5 * a_max * t2**2

    # Phase 3: Acceleration decay (jerk limited)
    t3 = t1  # Symmetric
    v3 = v2 + a_max * t3 - 0.5 * j_max * t3**2
    s3 = v2 * t3 + 0.5 * a_max * t3**2 - (1.0/6.0) * j_max * t3**3

    # Phase 4: Constant velocity (if needed)
    s_accel_total = s1 + s2 + s3
    s_constant = [distance - 2 * s_accel_total, 0].max
    t4 = s_constant > 0 ? s_constant / v3 : 0

    # Phases 5-7: Deceleration (mirror of acceleration)
    t5 = t3
    t6 = t2  
    t7 = t1

    # Generate time series data
    total_time = 2 * (t1 + t2 + t3) + t4
    time_points = []
    velocity_points = []
    position_points = []
    acceleration_points = []

    current_time = 0.0
    current_position = 0.0
    
    while current_time <= total_time
      time_points << current_time.round(4)
      
      # Determine which phase we're in and calculate values
      if current_time <= t1
        # Phase 1: Acceleration buildup
        t = current_time
        velocity = 0.5 * j_max * t**2
        acceleration = j_max * t
        position = current_position + (1.0/6.0) * j_max * t**3
      elsif current_time <= t1 + t2
        # Phase 2: Constant acceleration
        t = current_time - t1
        velocity = v1 + a_max * t
        acceleration = a_max
        position = current_position + s1 + v1 * t + 0.5 * a_max * t**2
      elsif current_time <= t1 + t2 + t3
        # Phase 3: Acceleration decay
        t = current_time - t1 - t2
        velocity = v2 + a_max * t - 0.5 * j_max * t**2
        acceleration = a_max - j_max * t
        position = current_position + s1 + s2 + v2 * t + 0.5 * a_max * t**2 - (1.0/6.0) * j_max * t**3
      elsif current_time <= t1 + t2 + t3 + t4
        # Phase 4: Constant velocity
        t = current_time - t1 - t2 - t3
        velocity = v3
        acceleration = 0
        position = current_position + s1 + s2 + s3 + v3 * t
      elsif current_time <= t1 + t2 + t3 + t4 + t5
        # Phase 5: Deceleration buildup
        t = current_time - t1 - t2 - t3 - t4
        velocity = v3 - 0.5 * j_max * t**2
        acceleration = -j_max * t
        position_delta = v3 * t - (1.0/6.0) * j_max * t**3
        position = current_position + s1 + s2 + s3 + s_constant + position_delta
      elsif current_time <= t1 + t2 + t3 + t4 + t5 + t6
        # Phase 6: Constant deceleration
        t = current_time - t1 - t2 - t3 - t4 - t5
        base_velocity = v3 - 0.5 * j_max * t5**2
        velocity = base_velocity - a_max * t
        acceleration = -a_max
        base_position = current_position + s1 + s2 + s3 + s_constant + v3 * t5 - (1.0/6.0) * j_max * t5**3
        position = base_position + base_velocity * t - 0.5 * a_max * t**2
      else
        # Phase 7: Deceleration decay
        t = current_time - t1 - t2 - t3 - t4 - t5 - t6
        base_velocity_6 = v3 - 0.5 * j_max * t5**2 - a_max * t6
        velocity = base_velocity_6 - a_max * t + 0.5 * j_max * t**2
        acceleration = -a_max + j_max * t
        # Position calculation for final phase
        base_position_6 = distance - (s1 + s2 + s3)  # Approximate
        position = base_position_6 + base_velocity_6 * t - 0.5 * a_max * t**2 + (1.0/6.0) * j_max * t**3
      end
      
      velocity_points << velocity.round(4)
      position_points << position.round(4)
      acceleration_points << acceleration.round(4)
      
      current_time += resolution
    end

    {
      time_points: time_points,
      velocity_profile: velocity_points,
      position_profile: position_points,
      acceleration_profile: acceleration_points,
      phases: {
        t1: t1.round(4),
        t2: t2.round(4), 
        t3: t3.round(4),
        t4: t4.round(4),
        t5: t5.round(4),
        t6: t6.round(4),
        t7: t7.round(4)
      },
      total_time: total_time.round(4),
      peak_velocity: v3.round(4)
    }
  end
end
