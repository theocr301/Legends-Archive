import rccLogo from './assets/RCC.logo.avif'
import './App.css'
import CarForm from './components/carForm';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CarHistory from './components/carHistory';


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
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar__logo">
              <img src={rccLogo} alt="RCC Logo" />
          </div>
          <div className="navbar__links">
            <ul>
              <li><a className="nav-link1" href="#https://www.racecar-classifieds.com/">HOME</a></li>
              <li><a className="nav-link2" href="#https://www.racecar-classifieds.com/forsale">RACECARS FOR SALE</a></li>
            </ul>
          </div>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="column">
                  <div className="content">
                    <h1>The new way to track old racecars</h1>
                      <p>Track everything from rebuilds to inspections, all the way to FIA HTP's. All in one place.</p>
                      <p>Legends Archive enables you to build a comprehensive history file for your car. It can be passed on during a sale, shared during the advertising phase, or just filled in and cherished</p>
                  </div>
                  <div className="createForm">
                    <h2>Add a new car</h2>
                      <p1>To start adding events to your car, register it here.</p1>
                        <CarForm onAddCar={onAddCar} />
                  </div>
                </div>
                <div className="cars carList" id="carList">
                  <h3>Recent cars</h3>
                  {loading && <p>Loading cars...</p>}
                  {error && <p className="error">Error: {error}</p>}
                  <div className="carCardsRow">
                    {cars.map(car => (
                      <Link key={car._id} to={`/car/${car._id}`}>
                        <CarCard car={car} />
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            }
          />
          <Route path="/car/:id" element={<CarHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

function CarCard({ car }) {
  return (
    <div className="car-card">
      <div className="carName">{car.name}</div>
      <div className="carYear">{car.year}</div>
      <div className="carChassis">#{car.chassisNumber}</div>
    </div>
  )
}

export default App
