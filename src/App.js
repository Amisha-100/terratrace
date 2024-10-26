import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen';
import ElectricityUsageForm from './ElectricityUsageForm';
import FlightUsageForm from './FlightUsageForm';
import VehicleUsageForm from './VehicleUsageForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/electricity-usage" element={<ElectricityUsageForm />} />
        <Route path="/flight-usage" element={<FlightUsageForm />} />
        <Route path="/vehicle-usage" element={<VehicleUsageForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;