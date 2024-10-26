import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./introLogo.png";

function WelcomeScreen() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/electricity-usage");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <img
                    src={logo}
                    alt="TERRATRACE logo"
                    className="w-[362px] h-[317px] md:w-auto md:h-auto max-w-full"
                />
                <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 font-sora">
                    TerraTrace
                </h1>
                <p className="text-gray-700 text-lg mb-6 font-sora text-center">
                    Find your carbon footprint and save the planet
                </p>
                <button
                    onClick={handleGetStarted}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 font-sora w-full"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
}

export default WelcomeScreen;