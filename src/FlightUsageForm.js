import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
// import './index.css'

function FlightUsageForm() {
  const [flightPassenger, setFlightPassenger] = useState('');
  const [flightDeparture, setFlightDeparture] = useState('');
  const [flightSource, setFlightSource] = useState('');
  const [flightCarbonFootprint, setFlightCarbonFootprint] = useState(null);
  const location = useLocation();
  const { electricCarbonFootprint } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();



    const data = {
        type: "flight",
        passengers: parseInt(flightPassenger),
        legs: [
            {departure_airport: flightDeparture, destination_airport: flightSource},
            {departure_airport: flightSource, destination_airport: flightDeparture}
        ]
    }

    try {
        const response = await fetch('https://www.carboninterface.com/api/v1/estimates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.REACT_APP_CARBON_INTERFACE_API_KEY}`
                },
            body: JSON.stringify(data)
            }
        );
        
        const result = await response.json();
        console.log(result)
        setFlightCarbonFootprint(result.data.attributes.carbon_mt);
        } 
        catch (error) {
        console.error(error);
        }

  };

  return (
    <div className="bg-inherit flex flex-col items-center justify-center h-screen">
    <h1 className="text-2xl font-bold mb-4">Flight Usage</h1>
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
    <textarea
        placeholder="Enter number of passengers (e.g., 3)"
        value={flightPassenger}
        onChange={(e) => setFlightPassenger(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md mb-4" // Add margin-bottom
    />
    <textarea
        placeholder="Enter number of passengers (e.g., 3)"
        value={flightDeparture}
        onChange={(e) => setFlightDeparture(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md mb-4" // Add margin-bottom
    />
    <textarea
        placeholder="Enter number of passengers (e.g., 3)"
        value={flightSource}
        onChange={(e) => setFlightSource(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md mb-4" // Add margin-bottom
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
        <p>Your estimated carbon footprint is: {flightCarbonFootprint} + {electricCarbonFootprint} MT CO2e</p>
        </div>
    )}
    </div>
  );
}

export default FlightUsageForm;