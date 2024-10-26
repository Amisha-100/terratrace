import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";

function VehicleUsageForm() {
    const [distanceValue, setDistanceValue] = useState(0.0);
    const [distanceUnit, setDistanceUnit] = useState('km');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
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
        <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Fuel Receipt (Optional)
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
                    
                    // For now, extract basic info from a sample receipt
                    // This is a placeholder until we implement proper OCR
                    const testData = {
                      liters: 45,
                      pricePerLiter: 1.5,
                      // Assuming average fuel efficiency of 12 km/L
                      estimatedDistance: 45 * 12
                    };
                    
                    setDistanceValue(testData.estimatedDistance);
                    setDistanceUnit('km');
                    
                    // TODO: Implement proper OCR using a dedicated service to:
                    // 1. Extract fuel quantity
                    // 2. Calculate distance based on average fuel efficiency
                    // 3. Track multiple receipts for better accuracy
                    
                    // TODO: Replace with actual OCR implementation
                    const text = "Sale";
                    
                    // Simple parsing - enhance this based on actual response format
                    const match = text.match(/(\d+\.?\d*)\s*(km|mi)/i);
                    if (match) {
                      setDistanceValue(match[1]);
                      setDistanceUnit(match[2].toLowerCase());
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
            <p className="mt-2 text-sm text-gray-500">Processing receipt...</p>
          )}
        </div>
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
                Distance travelled
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