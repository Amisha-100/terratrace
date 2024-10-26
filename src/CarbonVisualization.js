import React from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import generateRecommendations from './recommendations';

function CarbonVisualization() {
  const location = useLocation();
  const { electricCarbonFootprint, vehicleCarbonFootprint, flightCarbonFootprint } = location.state || {};
  const [recommendations, setRecommendations] = React.useState('');

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      const result = await generateRecommendations(
        electricCarbonFootprint,
        vehicleCarbonFootprint,
        flightCarbonFootprint
      );
      setRecommendations(result);
    };
    fetchRecommendations();
  }, [electricCarbonFootprint, vehicleCarbonFootprint, flightCarbonFootprint]);

  const data = [
    { name: 'Electricity', value: electricCarbonFootprint },
    { name: 'Vehicle', value: vehicleCarbonFootprint },
    { name: 'Flight', value: flightCarbonFootprint },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 p-8">
        <h2 className="text-2xl font-bold mb-4 text-center font-sora">Carbon Footprint Analysis</h2>
        <BarChart width={500} height={300} data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </div>
      <div className="w-1/2 p-8 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4 text-center font-sora">Recommendations</h2>
        <div className="whitespace-pre-wrap">{recommendations}</div>
      </div>
    </div>
  );
}

export default CarbonVisualization;
