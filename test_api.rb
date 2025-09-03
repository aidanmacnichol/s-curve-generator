#!/usr/bin/env ruby

require 'net/http'
require 'json'
require 'uri'

# Test the updated stepper motor API
uri = URI('http://localhost:3001/api/v1/stepper_curves/calculate')
http = Net::HTTP.new(uri.host, uri.port)

# Test parameters for the new calculation
test_params = {
  stepper_curve: {
    total_steps: 100,
    acc_steps: 20,
    dec_steps: 20,
    min_delay: 500,
    max_delay: 5000
  }
}

request = Net::HTTP::Post.new(uri)
request['Content-Type'] = 'application/json'
request.body = test_params.to_json

puts "Testing stepper motor calculation API..."
puts "Parameters: #{test_params[:stepper_curve]}"
puts "=" * 50

begin
  response = http.request(request)
  
  puts "Response Status: #{response.code}"
  puts "Response Body:"
  
  if response.code == '200'
    result = JSON.parse(response.body)
    if result['success']
      data = result['data']
      puts "✅ Calculation successful!"
      puts "Total Steps: #{data['total_steps']}"
      puts "Total Time: #{data['total_time']} seconds"
      puts "Acceleration Steps: #{data['acc_steps']}"
      puts "Deceleration Steps: #{data['dec_steps']}"
      puts "Speed Range: #{(1_000_000/data['max_delay']).round(2)} - #{(1_000_000/data['min_delay']).round(2)} steps/s"
      puts "Data Points: #{data['delays'].length}"
      
      # Show first few delays
      puts "\nFirst 10 delays (microseconds):"
      data['delays'].first(10).each_with_index do |delay, i|
        velocity = (1_000_000/delay).round(2)
        puts "  Step #{i}: #{delay.round(2)} μs (#{velocity} steps/s)"
      end
    else
      puts "❌ Calculation failed: #{result['error']}"
    end
  else
    puts "❌ HTTP Error: #{response.body}"
  end
  
rescue => e
  puts "❌ Connection failed: #{e.message}"
  puts "Make sure the Rails server is running on port 3001"
end
