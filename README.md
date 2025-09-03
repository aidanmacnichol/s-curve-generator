# Stepper Motor S-Curve Calculator

A web application for calculating and visualizing S-curve acceleration profiles for stepper motors. Built with React (TypeScript) frontend and Ruby on Rails API backend.

## Features

- **Interactive Calculator**: Input motor parameters and get instant S-curve calculations
- **Visual Charts**: See velocity, position, and acceleration profiles
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Data Export**: Download calculation results as CSV
- **Educational Content**: Learn about S-curve motion profiles

## Project Structure

```
stepper-motor-curve/
├── frontend/          # React TypeScript application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript type definitions
│   │   └── ...
│   └── package.json
├── backend/           # Ruby on Rails API
│   ├── app/
│   │   ├── controllers/   # API controllers
│   │   └── models/        # Data models
│   ├── config/            # Rails configuration
│   └── Gemfile
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Ruby (v3.1 or higher)
- PostgreSQL (optional, can use SQLite for development)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Ruby dependencies:
   ```bash
   bundle install
   ```

3. Start the Rails server:
   ```bash
   rails server -p 3001
   ```

   The API will be available at `http://localhost:3001`

## API Endpoints

### Calculate S-Curve Profile

**POST** `/api/v1/stepper_curves/calculate`

**Request Body:**
```json
{
  "stepper_curve": {
    "max_velocity": 1000,      // steps/sec
    "acceleration": 500,       // steps/sec²
    "jerk": 1000,             // steps/sec³
    "total_distance": 2000,   // steps
    "step_resolution": 0.001  // seconds (optional)
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "time_points": [0, 0.001, 0.002, ...],
    "velocity_profile": [0, 0.5, 2.0, ...],
    "position_profile": [0, 0.0001, 0.0008, ...],
    "acceleration_profile": [0, 1000, 1000, ...],
    "phases": {
      "t1": 0.5,    // Acceleration buildup
      "t2": 1.0,    // Constant acceleration  
      "t3": 0.5,    // Acceleration decay
      "t4": 0.0,    // Constant velocity
      "t5": 0.5,    // Deceleration buildup
      "t6": 1.0,    // Constant deceleration
      "t7": 0.5     // Deceleration decay
    },
    "total_time": 4.0,
    "peak_velocity": 1000
  }
}
```

## Understanding S-Curve Motion

S-curve motion profiles provide smooth acceleration by limiting jerk (the rate of change of acceleration). This results in:

- **Reduced Vibration**: Smooth transitions minimize mechanical stress
- **Improved Accuracy**: Better positioning precision
- **Extended Equipment Life**: Less wear on mechanical components
- **Quieter Operation**: Smoother motion reduces noise

### Motion Phases

1. **Acceleration Buildup** (t1): Jerk-limited acceleration increase
2. **Constant Acceleration** (t2): Maximum acceleration phase
3. **Acceleration Decay** (t3): Jerk-limited acceleration decrease
4. **Constant Velocity** (t4): Steady-state motion (if needed)
5. **Deceleration Buildup** (t5): Jerk-limited deceleration increase
6. **Constant Deceleration** (t6): Maximum deceleration phase
7. **Deceleration Decay** (t7): Jerk-limited deceleration decrease

## Development

### Frontend Development

The frontend is built with:
- **React 18** with TypeScript
- **React Router** for navigation
- **CSS Modules** for styling
- Responsive design with CSS Grid and Flexbox

Key components:
- `HomePage`: Landing page with educational content
- `CalculatorPage`: Main calculation interface
- `ParameterForm`: Input form for motor parameters
- `ResultsDisplay`: Charts and data visualization

### Backend Development

The backend is a Rails API with:
- RESTful API design
- CORS configuration for frontend integration
- Comprehensive S-curve calculation algorithm
- Input validation and error handling

Key files:
- `StepperCurvesController`: Main API controller
- S-curve calculation logic with 7-phase motion profile
- JSON response formatting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the Rails backend is running on port 3001 and CORS is properly configured
2. **Port Conflicts**: Make sure ports 3000 (frontend) and 3001 (backend) are available
3. **Dependencies**: Run `npm install` in frontend and `bundle install` in backend if you encounter missing dependencies

### Getting Help

- Check the browser console for frontend errors
- Check the Rails server logs for backend errors
- Ensure both servers are running before testing the calculator

---

**Happy Calculating!** 🚀
