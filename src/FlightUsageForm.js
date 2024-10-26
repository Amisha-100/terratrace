import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function FlightUsageForm() {
  const [flightPassenger, setFlightPassenger] = useState('');
  const [flightCarbonFootprint, setFlightCarbonFootprint] = useState(null);
  const location = useLocation();
  const { electricCarbonFootprint } = location.state || {};  // Access the passed state

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        type: "flight",
        passengers: parseInt(flightPassenger),
        legs: [
            { departure_airport: "bom", destination_airport: "cok" },
            { departure_airport: "cok", destination_airport: "bom" }
        ]
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
        setFlightCarbonFootprint(result.data.attributes.carbon_mt);
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div className="bg-inherit flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Flight Usage</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <textarea
          placeholder="Enter number of flights taken in past year (e.g., 3)"
          value={flightPassenger}
          onChange={(e) => setFlightPassenger(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-md mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Calculate Carbon Footprint
        </button>
      </form>

      {flightCarbonFootprint && (
        <div className="mt-4">
          <p>Your estimated carbon footprint is: {flightCarbonFootprint + electricCarbonFootprint} MT CO2e</p>
        </div>
      )}
    </div>
  );
}

export default FlightUsageForm;
