const { GoogleGenerativeAI } = await import("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const generateRecommendations = async (electricityScore, vehicleScore, flightScore) => {
  const prompt = `You are an environmentalist. I will give you the carbon footprint score of Electricity, Vehicle, and Flights. The carbon footprint score of Electricity is ${electricityScore}, Vehicle is ${vehicleScore}, and Flights is ${flightScore}. Generate the most valid recommendations to reduce these carbon footprints and also generate viable ways to reduce the carbon footprint.`;

  const result = await model.generateContent(prompt);
  const recommendations = result.response.text();

  return recommendations
};


// const generateImages = async (recommendations) => {
//   const imagePrompts = [];

//   // Assuming recommendations are in a list or array
//   for (const recommendation of recommendations) {
//     // Extract keywords for image generation
//     const keywords = recommendation.split(" ");

//     // Construct image prompt
//     let imagePrompt = "";
//     keywords.forEach(keyword => {
//       imagePrompt += keyword + " ";
//     });

//     imagePrompts.push(imagePrompt);
//   }

//   // Generate images using Gemini
//   const images = await model.generateImages({
//     prompts: imagePrompts,
//     imageGenerationUsecase: "alternatives",
//   });

//   return images;
// };


// const images = await generateImages(recommendations);

export default generateRecommendations;
