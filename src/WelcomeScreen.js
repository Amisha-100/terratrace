import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomeScreen.css';
import introLogo from './introLogo.png';

function WelcomeScreen() {
  return (
    <div className="welcome-screen">
        <div className="centered-content">
      <h1>TerraTrace</h1>
      <p>Find your carbon footprint and save the planet</p>
      <img src={introLogo} alt="TerraTrace Logo" />
      <Link to="/electricity-usage">
        <button>Get Started</button>
      </Link>
      </div>
    </div>
  );
}

export default WelcomeScreen;

