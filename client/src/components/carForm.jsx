//import { set } from 'mongoose';
import { useState } from 'react';

export default function CarForm({ onAddCar}) {
  const [form, setForm] = useState({
    name: '',
    year: '',
    chassisNumber: '',
  });

  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.year || !form.chassisNumber) {
      alert('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    const result = await onAddCar({
      name: form.name,
      year: form.year,
      chassisNumber: form.chassisNumber,
    });
    setSubmitting(false);

    if (result.success) {
      setForm({
        name: '',
        year: '',
        chassisNumber: '',
      })
    }
  }
  return (
    <form onSubmit={handleSubmit} className="carForm">
      <div className="inputBox">
        <label htmlFor="name">NAME</label>
        <input
          className="typeHere"
          type="text"
          name="name"
          id="name"
          placeholder="Make and model..."
          value={form.name}
          onChange={handleChange}
          required
          disabled={submitting}
        />
      </div>
      <div className="inputBox">
        <label htmlFor="year">YEAR</label>
        <input
          className="typeHere"
          type="number"
          name="year"
          id="year"
          placeholder="Build year..."
          value={form.year}
          onChange={handleChange}
          required
          disabled={submitting}
        />
      </div>
      <div className="inputBox">
        <label htmlFor="chassisNumber">CHASSIS NUMBER</label>
        <input
          className="typeHere"
          type="number"
          name="chassisNumber"
          id="chassisNumber"
          placeholder="Chassis number..."
          value={form.chassisNumber}
          onChange={handleChange}
          required
          disabled={submitting}
        />
      </div>
      <button className="button" type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Create"}
      </button>
    </form>
  );
}