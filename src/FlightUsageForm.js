import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const COUNTRY_TO_AIRPORT = {
  'united states': 'JFK',
  'india': 'DEL',
  'united kingdom': 'LHR',
  'china': 'PEK',
  'japan': 'HND',
  'australia': 'SYD',
  'canada': 'YYZ',
  'germany': 'FRA',
  'france': 'CDG',
  'italy': 'FCO',
  'south korea': 'ICN',
  'brazil': 'GRU',
  'mexico': 'MEX',
  'spain': 'MAD',
  'russia': 'SVO',
  'netherlands': 'AMS',
  'singapore': 'SIN',
  'thailand': 'BKK',
  'malaysia': 'KUL',
  'indonesia': 'CGK',
  'philippines': 'MNL',
  'vietnam': 'SGN',
  'south africa': 'JNB',
  'nigeria': 'LOS',
  'egypt': 'CAI',
  'morocco': 'CMN',
  'algeria': 'ALG',
  'kenya': 'NBO',
  'ethiopia': 'ADD',
  'argentina': 'EZE',
  'chile': 'SCL',
  'colombia': 'BOG',
  'peru': 'LIM',
  'venezuela': 'CCS',
  'turkey': 'IST',
  'israel': 'TLV',
  'saudi arabia': 'JED',
  'united arab emirates': 'DXB',
  'qatar': 'DOH',
  'oman': 'MCT'
};

const getAirportCode = (country) => {
  const normalizedCountry = country.trim().toLowerCase();
  return COUNTRY_TO_AIRPORT[normalizedCountry] || '';
};

function FlightUsageForm() {
  const [flightPassenger, setFlightPassenger] = useState('');
  const [sourceAirport, setSourceAirport] = useState('');
  const [destinationAirport, setDestinationAirport] = useState('');
  const [flightCarbonFootprint, setFlightCarbonFootprint] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { electricCarbonFootprint, vehicleCarbonFootprint } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        type: "flight",
        passengers: parseInt(flightPassenger),
        legs: [
            { departure_airport: sourceAirport.toLowerCase(), destination_airport: destinationAirport.toLowerCase() },
            { departure_airport: destinationAirport.toLowerCase(), destination_airport: sourceAirport.toLowerCase() }
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

        if (result.data && result.data.attributes) {
          const carbonFootprint = result.data.attributes.carbon_mt;

          // Navigate to the new page after form submission
          navigate('/results', { state: { electricCarbonFootprint: electricCarbonFootprint,
              vehicleCarbonFootprint: vehicleCarbonFootprint, 
              flightCarbonFootprint: carbonFootprint
            }
          });
      } else {
          console.error("Unexpected API response structure", result);
      }
        setFlightCarbonFootprint(result.data.attributes.carbon_mt);
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 font-sora">
          Your flight Usage (Yearly)
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <label htmlFor="source" className="block text-gray-700 font-sora mb-2">
              Source Airport (IATA code)
            </label>
            <input
              type="text"
              id="source"
              placeholder="Enter country (e.g., United States)"
              value={sourceAirport}
              onChange={(e) => {
                const code = getAirportCode(e.target.value);
                setSourceAirport(code || e.target.value);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            />
            
            <label htmlFor="destination" className="block text-gray-700 font-sora mb-2">
              Destination Airport (IATA code)
            </label>
            <input
              type="text"
              id="destination"
              placeholder="Enter country (e.g., India)"
              value={destinationAirport}
              onChange={(e) => {
                const code = getAirportCode(e.target.value);
                setDestinationAirport(code || e.target.value);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            />

            <label htmlFor="passengers" className="block text-gray-700 font-sora mb-2">
              Number of Flights
            </label>
            <input
              type="number"
              id="passengers"
              placeholder="e.g., 2"
              value={flightPassenger}
              onChange={(e) => setFlightPassenger(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 font-sora"
          >
            Calculate Carbon Footprint
          </button>
        </form>
      </div>
    </div>
  );
}

export default FlightUsageForm;