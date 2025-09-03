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
    # Extract parameters and convert to integers for step counts
    total_steps = params_data[:total_steps].to_i
    acc_steps = params_data[:acc_steps].to_i
    dec_steps = params_data[:dec_steps].to_i
    min_delay = params_data[:min_delay].to_f
    max_delay = params_data[:max_delay].to_f

    # Basic error checking
    if acc_steps <= 0 || acc_steps > total_steps / 2
      acc_steps = (total_steps / 2.0).round
    end 

    if dec_steps <= 0 || dec_steps > total_steps / 2
      dec_steps = (total_steps / 2.0).round
    end

    delays = Array.new(total_steps, 0.0)
    dec_start = total_steps - dec_steps

    # Generate cubic acceleration curve
    t = (0...acc_steps).map { |i| i.to_f / (acc_steps - 1)}

    # Acceleration & deceleration profiles
    cubic_acc = t.map { |val| (3 * val**2) - (2 * val**3) }
    cubic_dec = cubic_acc.reverse

    # Interpolate delays along curve (acceleration)
    acc_diff = min_delay - max_delay
    (0...acc_steps).each do |i|
      delays[i] = max_delay + acc_diff * cubic_acc[i]
    end

    (acc_steps...dec_start).each do |i|
      delays[i] = min_delay
    end

    # Interpolate delays along curve (deceleration)
    (dec_start...total_steps).each_with_index do |i, j|
      delays[i] = max_delay + acc_diff * cubic_dec[j]
    end

    # Convert delays to more useful data for frontend
    step_numbers = (0...total_steps).to_a
    cumulative_time = 0.0
    time_points = []
    position_profile = []
    
    delays.each_with_index do |delay, i|
      time_points << cumulative_time.round(6)
      position_profile << i
      cumulative_time += delay
    end
    
    # Calculate velocities (steps per second = 1/delay)
    velocity_profile = delays.map { |delay| delay > 0 ? (1.0 / delay).round(4) : 0 }
    
    # Calculate accelerations (change in velocity / time)
    acceleration_profile = []
    (0...delays.length).each do |i|
      if i == 0
        acceleration_profile << 0
      else
        vel_change = velocity_profile[i] - velocity_profile[i-1]
        time_change = delays[i-1] > 0 ? delays[i-1] : 0.001
        acceleration_profile << (vel_change / time_change).round(4)
      end
    end

    {
      step_numbers: step_numbers,
      delays: delays.map { |d| d.round(6) },
      time_points: time_points,
      velocity_profile: velocity_profile,
      position_profile: position_profile,
      acceleration_profile: acceleration_profile,
      total_steps: total_steps.to_i,
      total_time: cumulative_time.round(6),
      min_delay: min_delay,
      max_delay: max_delay,
      acc_steps: acc_steps.to_i,
      dec_steps: dec_steps.to_i
    }
  end
end

