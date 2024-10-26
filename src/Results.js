import React from 'react'
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import generateRecommendations from './recommendations';

const Results = () => {
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
    { name: 'Elect', value: electricCarbonFootprint },
    { name: 'Vehicle', value: vehicleCarbonFootprint },
    { name: 'Flight', value: flightCarbonFootprint },
  ];

  return (
    <div className="flex min-h-screen">
    <div className="w-1/2 p-8">
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2 text-gray-800">Average Carbon Footprint</h3>
          <p className="text-2xl text-green-600 font-bold">
            {Math.round(electricCarbonFootprint + vehicleCarbonFootprint + (flightCarbonFootprint / 3), 3)} MTCO2e
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Electricity</h4>
            <p className="text-xl text-green-600">{electricCarbonFootprint} MTCO2e</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Vehicle</h4>
            <p className="text-xl text-green-600">{vehicleCarbonFootprint} MTCO2e</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Flight</h4>
            <p className="text-xl text-green-600">{flightCarbonFootprint} MTCO2e</p>
          </div>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
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
      <div className="space-y-6">
        {recommendations.split('##').filter(Boolean).map((section, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ 
                __html: ('##' + section)
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
                  .replace(/## (.*?)\n/g, '<h2 class="text-xl font-bold mb-3">$1</h2>')
                  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:text-green-700 underline">$1</a>')
                  .replace(/\* (.*?)(?=\n|$)/g, '<p class="text-sm mb-2">• $1</p>')
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default Results
