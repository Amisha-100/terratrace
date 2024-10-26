import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './index.css'

function VehicleUsageForm() {
  const [distanceValue, setDistanceValue] = useState(0.0);
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [vehicleCarbonFootprint, setVehicleCarbonFootprint] = useState(null);
  const navigate = useNavigate(); // useNavigate hook for navigation
  const location = useLocation();
  const { electricCarbonFootprint } = location.state || {};  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        type: "vehicle",
        distance_unit: distanceUnit,
        distance_value: parseFloat(distanceValue),
        vehicle_model_id: "7268a9b7-17e8-4c8d-acca-57059252afe9"
    };

    try {
        const apiKey = process.env.REACT_APP_CARBON_INTERFACE_API_KEY;

        const response = await fetch('https://www.carboninterface.com/api/v1/estimates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        if (result.data && result.data.attributes) {
            const carbonFootprint = result.data.attributes.carbon_mt;
            setVehicleCarbonFootprint(carbonFootprint);

            // Navigate to the new page after form submission
            navigate('/flight-usage', { state: { electricCarbonFootprint: electricCarbonFootprint,
                vehicleCarbonFootprint: carbonFootprint
             } });
        } else {
            console.error("Unexpected API response structure", result);
        }
    } catch (error) {
        console.error('Error:', error);
    }
  };

  return (
    <div className="bg-inherit flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Vehicle Usage</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <select
          value={distanceUnit}
          onChange={(e) => setDistanceUnit(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="km">Kilometers (Km)</option>
          <option value="mi">Miles (Mi)</option>
        </select>
        <textarea
          placeholder="Enter distance travelled (e.g., 1000)"
          value={distanceValue}
          onChange={(e) => setDistanceValue(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-md mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default VehicleUsageForm;
