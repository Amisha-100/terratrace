const { GoogleGenerativeAI } = await import("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateRecommendations = async (electricityScore, vehicleScore, flightScore) => {
  const vehiclePrompt = vehicleScore === 0 ? `
## 🚗 Vehicle (Score: ${vehicleScore})

**Excellent work!** Your vehicle score shows you're making sustainable transportation choices.

* **Keep it up!** Continue your current eco-friendly transportation habits.
* Consider an **electric vehicle** for any future car needs.` 
  : `[Assessment of vehicle score, followed by 3-4 bullet points with recommendations, using similar formatting with bold terms]`;

  const prompt = `Based on these carbon footprint scores, provide recommendations:
    - Electricity: ${electricityScore}
    - Vehicle: ${vehicleScore}
    - Flight: ${flightScore}

    Format as follows (exactly):

## 🔋 Electricity (Score: ${electricityScore})

Your electricity score is **above average**, meaning you have room for improvement to reduce your carbon footprint. Here are some recommendations:

* **Switch to a renewable energy provider.** Many utilities offer plans powered by **solar, wind, or hydro**. This directly reduces your reliance on fossil fuels.
* **Upgrade your appliances.** Older appliances use **more energy** than modern, energy-efficient models. Look for **Energy Star** labels when replacing your refrigerator, washer, dryer, or other appliances.
* **Reduce your energy consumption.** Turn off lights when leaving a room, unplug unused electronics, and use **energy-saving bulbs**.
* **Use smart power strips.** These turn off electronics when not in use, preventing **phantom energy consumption**.

${vehiclePrompt}

## ✈️ Flight (Score: ${flightScore})

[Assessment of flight score, followed by 3-4 bullet points with recommendations, using similar formatting with bold terms]`;

  const result = await model.generateContent(prompt);
  const recommendations = result.response.text();

  return recommendations;
};

export default generateRecommendations;
