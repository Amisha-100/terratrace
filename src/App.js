import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen';
import ElectricityUsageForm from './ElectricityUsageForm';
import FlightUsageForm from './FlightUsageForm';

function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen   
   />} />
          <Route path="/electricity-usage" element={<ElectricityUsageForm />} />
          <Route path="/flight-usage" element={<FlightUsageForm />} />
        </Routes>
      </BrowserRouter>
    );
  }


export default App;