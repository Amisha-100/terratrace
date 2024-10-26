// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './index.css'

// function ElectricityUsageForm() {
//   const [electricityUsage, setElectricityUsage] = useState('100');
//   const [electricityUnit, setElectricityUnit] = useState('kWh');
//   const [electricCarbonFootprint, setElectricCarbonFootprint] = useState(null);
//   const navigate = useNavigate(); // useNavigate hook for navigation

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = {
//         type: "electricity",
//         electricity_value: parseInt(electricityUsage),
//         electricity_unit: electricityUnit,
//         country: "us"
//     };

//     try {
//         const apiKey = process.env.REACT_APP_CARBON_INTERFACE_API_KEY;

//         const response = await fetch('https://www.carboninterface.com/api/v1/estimates', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${apiKey}`
//             },
//             body: JSON.stringify(data)
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log(result);

//         if (result.data && result.data.attributes) {
//             const carbonFootprint = result.data.attributes.carbon_mt;
//             setElectricCarbonFootprint(carbonFootprint);

//             // Navigate to the new page after form submission
//             navigate('/vehicle-usage', { state: { electricCarbonFootprint: carbonFootprint } });
//         } else {
//             console.error("Unexpected API response structure", result);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="bg-inherit flex flex-col items-center justify-center h-screen">
//       <h1 className="text-2xl font-bold mb-4">Electricity Usage</h1>
//       <form onSubmit={handleSubmit} className="flex flex-col items-center">
//         <textarea
//           placeholder="Enter your electricity usage (e.g., 1000)"
//           value={electricityUsage}
//           onChange={(e) => setElectricityUsage(e.target.value)}
//           className="w-full p-4 border border-gray-300 rounded-md mb-4"
//         />
//         <select
//           value={electricityUnit}
//           onChange={(e) => setElectricityUnit(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-md"
//         >
//           <option value="kWh">Kilowatt-hours (kWh)</option>
//           <option value="MWh">Megawatt-hours (MWh)</option>
//         </select>
//         <button
//           type="submit"
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Continue
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ElectricityUsageForm;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ElectricityUsageForm() {
  const [electricityUsage, setElectricityUsage] = useState('100');
  const [electricityUnit, setElectricityUnit] = useState('kWh');
  const [electricCarbonFootprint, setElectricCarbonFootprint] = useState(null);
  const navigate = useNavigate();

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
                const carbonFootprint = result.data.attributes.carbon_mt;
                setElectricCarbonFootprint(carbonFootprint);
    
                navigate('/vehicle-usage', { state: { electricCarbonFootprint: carbonFootprint } });
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
          Your electricity usage
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col">

          <div className="mb-4">
            <label htmlFor="unit" className="block text-gray-700 font-sora">
              Enter unit
            </label>
            <select
              id="unit"
              value={electricityUnit}
              onChange={(e) => setElectricityUnit(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="kWh">kWh</option>
              <option value="MWh">MWh</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="value" className="block text-gray-700 font-sora">
              Enter value
            </label>
            <input
              type="number"
              id="value"
              value={electricityUsage}
              onChange={(e) => setElectricityUsage(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 font-sora"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default ElectricityUsageForm;