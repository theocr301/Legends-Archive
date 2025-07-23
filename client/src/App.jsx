import rccLogo from './assets/RCC.pdf'
import './App.css'
import CarForm from './components/carForm';
import React, { useState, useEffect } from 'react';


const API_BASE = "http://localhost:5001";

function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchCars() {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/cars`);
      if (!response.ok) throw new Error("Error fetching cars");
      const data = await response.json();
      setCars(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCars();
  }, []);

  async function onAddCar(carData) {
    try {
      const res = await fetch(`${API_BASE}/cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData),
      });
      if (res.ok) {
        fetchCars();
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, message: error.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }


  return (

      <div className="App">
        <nav className="navbar">
          <div className="navbar__logo">

              <img src={rccLogo} alt="RCC Logo" />

          </div>
          <div className="navbar__links">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#forsale">Racecars for sale</a></li>
            </ul>
          </div>
        </nav>
        <div className="content">
          <h1>The new way to track old racecars</h1>
          <p>Track everything from rebuilds to inspections, all the way to FIA HTP's. All in one place.</p>
          
        </div>
        <div className="createForm">
        <div className="createForm">
          <h2>Add a new car</h2>
          <CarForm onAddCar={onAddCar} />
        </div>
      </div>
      </div>
  );
}

function CarCard({ car }) {
  return (
    <div className="car-card">
      <div className="carName">{car.name}</div>
      <div className="carYear">{car.year}</div>
      <div className="carChassis">{car.chassisNumber}</div>
    </div>
  )
}

export default App
