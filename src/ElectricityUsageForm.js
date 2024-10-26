import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css'

function ElectricityUsageForm() {
  const [electricityUsage, setElectricityUsage] = useState('100');
  const [electricityUnit, setElectricityUnit] = useState('kWh');
  const [electricCarbonFootprint, setElectricCarbonFootprint] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        type: "electricity",
        electricity_value: parseInt(electricityUsage),
        electricity_unit: electricityUnit,
        country: "us"
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
            setElectricCarbonFootprint(result.data.attributes.carbon_mt);
        } else {
            console.error("Unexpected API response structure", result);
        }
    } catch (error) {
        console.error('Error:', error);
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
    <Link
    to={{
    pathname: "/flight-usage",
    state: { electricCarbonFootprint }
    }}
    >    
    <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
        Continue
    </button>
    </Link>
    </form>
    {/* {carbonFootprint && (
        <div className="mt-4">
        <p>Your estimated carbon footprint is: {carbonFootprint} MT CO2e</p>
        </div>
    )} */}
    </div>
  );
}

export default ElectricityUsageForm;
