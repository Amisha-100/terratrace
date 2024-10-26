import React from 'react'
import { useLocation } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const { electricCarbonFootprint, vehicleCarbonFootprint, flightCarbonFootprint } = location.state || {};
  return (
    <div>
        <div className="mt-4">
          <p>Your estimated carbon footprint is: {electricCarbonFootprint} + {vehicleCarbonFootprint} + {flightCarbonFootprint} MT CO2e</p>
        </div>
    </div>
  )
}

export default Results
