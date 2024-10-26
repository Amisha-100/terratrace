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
import { GoogleGenerativeAI } from "@google/generative-ai";

function ElectricityUsageForm() {
  const [electricityUsage, setElectricityUsage] = useState('100');
  const [electricityUnit, setElectricityUnit] = useState('kWh');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
          Your electricity Usage (Yearly)
        </h2>

        <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Electricity Bill (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedFile(file);
                setIsProcessing(true);
                
                try {
                  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
                  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                  const reader = new FileReader();
                  reader.onloadend = async () => {
                    const imageUrl = reader.result;
                    
                    // For now, use a simple regex to extract numbers followed by kWh/MWh
                    // This is a placeholder until we implement proper OCR
                    const testData = "Your electricity usage: 450 kWh";
                    const match = testData.match(/(\d+\.?\d*)\s*(kWh|MWh)/i);
                    if (match) {
                      setElectricityUsage(match[1]);
                      setElectricityUnit(match[2].toLowerCase());
                    }
                    
                    // TODO: Implement proper OCR using a dedicated service
                    // Options:
                    // 1. Google Cloud Vision API
                    // 2. Tesseract.js for client-side OCR
                    // 3. Azure Computer Vision
                    
                    // TODO: Replace with actual OCR implementation
                    const text = "Total Amount Payable";
                    
                    // Simple parsing - enhance this based on actual response format
                    const extractedMatch = text.match(/(\d+\.?\d*)\s*(kWh|MWh)/i);
                    if (extractedMatch) {
                      setElectricityUsage(extractedMatch[1]);
                      setElectricityUnit(extractedMatch[2].toLowerCase());
                    }
                  };
                  reader.readAsDataURL(file);
                } catch (error) {
                  console.error('Error processing image:', error);
                } finally {
                  setIsProcessing(false);
                }
              }
            }}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
          />
          {isProcessing && (
            <p className="mt-2 text-sm text-gray-500">Processing bill...</p>
          )}
        </div>
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