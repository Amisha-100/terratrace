const { GoogleGenerativeAI } = await import("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Sample affiliate links - In production, these would come from a database or API
const AFFILIATE_LINKS = {
  energy: {
    solarCity: "https://www.tesla.com/solarpanels",
    nestThermostat: "https://store.google.com/product/nest_learning_thermostat",
    ledBulbs: "https://www.philips-hue.com/",
  },
  vehicle: {
    tesla: "https://www.tesla.com",
    electricBikes: "https://www.radpowerbikes.com",
    chargingStations: "https://www.chargepoint.com",
  },
  flight: {
    offsetPrograms: "https://www.goldstandard.org",
    trainBooking: "https://www.amtrak.com",
    busBooking: "https://www.greyhound.com",
  }
};

const generateRecommendations = async (electricityScore, vehicleScore, flightScore) => {
  const vehiclePrompt = vehicleScore === 0 ? `
## 🚗 Vehicle (Score: ${vehicleScore})

**Excellent work!** Your vehicle score shows you're making sustainable transportation choices.

* **Keep it up!** Continue your current eco-friendly transportation habits.
* Consider an **electric vehicle** for any future car needs. [Check out Tesla's latest models](${AFFILIATE_LINKS.vehicle.tesla}).` 
  : `[Assessment of vehicle score, followed by 3-4 bullet points with recommendations, using similar formatting with bold terms]`;

  const prompt = `Based on these carbon footprint scores, provide recommendations:
    - Electricity: ${electricityScore}
    - Vehicle: ${vehicleScore}
    - Flight: ${flightScore}

    Format as follows (exactly):

## 🔋 Electricity (Score: ${electricityScore})

Your electricity score is **above average**, meaning you have room for improvement to reduce your carbon footprint. Here are some recommendations:

* **Switch to a renewable energy provider.** Many utilities offer plans powered by **solar, wind, or hydro**. Consider [installing solar panels](${AFFILIATE_LINKS.energy.solarCity}) to directly reduce your reliance on fossil fuels.
* **Upgrade your appliances.** Older appliances use **more energy** than modern, energy-efficient models. Start with a [smart thermostat](${AFFILIATE_LINKS.energy.nestThermostat}) for efficient temperature control.
* **Reduce your energy consumption.** Turn off lights when leaving a room, unplug unused electronics, and use [energy-saving smart bulbs](${AFFILIATE_LINKS.energy.ledBulbs}).
* **Use smart power strips.** These turn off electronics when not in use, preventing **phantom energy consumption**.

${vehiclePrompt}

## ✈️ Flight (Score: ${flightScore})

Your flight score indicates room for improvement. Here are some eco-friendly alternatives:

* **Consider train travel** for shorter trips. [Book train tickets](${AFFILIATE_LINKS.flight.trainBooking}) for a scenic, low-carbon journey.
* **Offset your flights.** Support verified [carbon offset projects](${AFFILIATE_LINKS.flight.offsetPrograms}) to compensate for your air travel.
* **Choose alternative transport.** [Long-distance buses](${AFFILIATE_LINKS.flight.busBooking}) are an eco-friendly option for many routes.`;

  const result = await model.generateContent(prompt);
  const recommendations = result.response.text();

  return recommendations;
};

export default generateRecommendations;
