import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen';
import ElectricityUsageForm from './ElectricityUsageForm';

function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen   
   />} />
          <Route path="/electricity-usage" element={<ElectricityUsageForm />} />
        </Routes>
      </BrowserRouter>
    );
  }


export default App;