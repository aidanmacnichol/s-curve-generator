# Quick Start Guide

## 🚀 Your Stepper Motor S-Curve Calculator is Ready!

Both frontend and backend servers are now running:

- **Frontend (React)**: http://localhost:3000
- **Backend (Rails API)**: http://localhost:3001

## 🧪 Test the Application

1. **Open your browser** and go to http://localhost:3000
2. **Navigate through the app**:
   - Home page explains S-curve motion profiles
   - Click "Calculator" to input parameters
3. **Try the calculator**:
   - Use the default values or try the preset examples
   - Click "Calculate S-Curve" to see results
   - Download CSV data if needed

## 📝 Sample Test Parameters

### Quick Test
```
Max Velocity: 1000 steps/sec
Acceleration: 500 steps/sec²
Jerk: 1000 steps/sec³
Total Distance: 2000 steps
Step Resolution: 0.001 sec
```

### High-Speed Test
```
Max Velocity: 2000 steps/sec
Acceleration: 1000 steps/sec²
Jerk: 2000 steps/sec³
Total Distance: 5000 steps
Step Resolution: 0.001 sec
```

## 🛠 Development Commands

### Frontend Commands
```bash
cd frontend
npm start          # Start development server
npm run build      # Create production build
npm test           # Run tests
```

### Backend Commands
```bash
cd backend
./bin/rails server -p 3001    # Start Rails server
./bin/rails console           # Rails console
bundle install                # Install gems
```

## 🔧 Project Features

### ✅ Completed Features
- [x] React TypeScript frontend with routing
- [x] Ruby on Rails API backend
- [x] Responsive design with modern CSS
- [x] S-curve calculation algorithm (7-phase motion profile)
- [x] Parameter input form with validation
- [x] Results display with summary statistics
- [x] Phase breakdown visualization
- [x] CSV data export functionality
- [x] Error handling and loading states
- [x] Educational homepage content
- [x] CORS configuration for API access

### 🎯 Core Functionality
- **Motion Calculation**: Complete 7-phase S-curve algorithm
- **Real-time Validation**: Form validation with helpful error messages
- **Data Visualization**: SVG-based chart placeholders (ready for charting library)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Educational Content**: Homepage explains S-curve benefits and applications

### 📊 Future Enhancements (Ideas)
- [ ] Interactive charts with Chart.js or D3.js
- [ ] Real-time parameter adjustment with sliders
- [ ] Motor profile presets database
- [ ] 3D visualization of motion profiles
- [ ] Performance optimization for large datasets
- [ ] User accounts and saved calculations
- [ ] Export to other formats (PDF, Excel)
- [ ] Integration with stepper motor hardware APIs

## 🐛 Troubleshooting

### Port Already in Use
If you get port errors:
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:3001 | xargs kill -9  # Backend
```

### CORS Issues
If you see CORS errors in the browser console:
1. Ensure backend is running on port 3001
2. Check that CORS is configured in `config/application.rb`

### Dependencies
If you encounter missing dependencies:
```bash
# Frontend
cd frontend && npm install

# Backend  
cd backend && bundle install
```

## 📚 API Documentation

The API endpoint is available at:
```
POST http://localhost:3001/api/v1/stepper_curves/calculate
```

See the main README.md for detailed API documentation.

---

**Enjoy building with your new Stepper Motor S-Curve Calculator!** 🎉
