import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 font-sora">
                    Vehicle Usage (Yearly)
                </h2>
        <form onSubmit={handleSubmit} className="flex flex-col mb-4">
        <div className="mb-4">
        <label htmlFor="mileage"
              className="block text-gray-700 font-sora">
              Unit of Distance
          </label>
         <select
          value={distanceUnit}
          onChange={(e) => setDistanceUnit(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="km">Kilometers (Km)</option>
          <option value="mi">Miles (Mi)</option>
        </select>
        </div>
        <div className="mb-4">
        <label htmlFor="mileage"
                className="block text-gray-700 font-sora">
                Mileage
          </label>
        <input
          type="number"
          placeholder="Enter distance travelled (e.g., 1000)"
          value={distanceValue}
          onChange={(e) => setDistanceValue(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 font-sora">
          Continue
        </button>
      </form>   
            </div>
        </div>
    );
}

export default VehicleUsageForm;