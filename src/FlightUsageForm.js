import React, { useState } from 'react';
import './index.css'

function FlightUsageForm() {
  const [flightUsage, setFlightUsage] = useState('100');
  const [electricityUnit, setElectricityUnit] = useState('kWh');
  const [carbonFootprint, setCarbonFootprint] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();



    const data = {
        type: "electricity",
        electricity_value: parseInt(flightUsage),
        electricity_unit: electricityUnit,
        country: "us"
    };

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
        setCarbonFootprint(result.data.attributes.carbon_mt);
        } 
        catch (error) {
        console.error(error);
        }

  };

  return (
    <div className="bg-inherit flex flex-col items-center justify-center h-screen">
    <h1 className="text-2xl font-bold mb-4">Electricity Usage</h1>
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
    <textarea
        placeholder="Enter your electricity usage (e.g., 1000)"
        value={electricityUsage}
        onChange={(e) => setElectricityUsage(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md mb-4" // Add margin-bottom
    />
    <select
        value={electricityUnit}
        onChange={(e) => setElectricityUnit(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
    >
        <option value="kWh">Kilowatt-hours (kWh)</option>
        <option value="MWh">Megawatt-hours (MWh)</option>
    </select>
    <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
        Calculate Carbon Footprint
    </button>
    </form>
    {carbonFootprint && (
        <div className="mt-4">
        <p>Your estimated carbon footprint is: {carbonFootprint} MT CO2e</p>
        </div>
    )}
    </div>
  );
}

export default FlightUsageForm;