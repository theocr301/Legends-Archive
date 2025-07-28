import { useState } from 'react';


export default function CarForm({ onAddCar}) {
  const [form, setForm] = useState({
    name: '',
    year: '',
    chassisNumber: '',
    image: null,
  });

  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.year || !form.chassisNumber) {
      alert('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('year', form.year);
    formData.append('chassisNumber', form.chassisNumber);
    if (form.image) formData.append('image', form.image);

    try {
      const result = await onAddCar(formData);
      setSubmitting(false);

      if (result.success) {
        setForm({
          name: '',
          year: '',
          chassisNumber: '',
          image: null,
        });
      } else {
        alert(result.message || 'Error adding car');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form');
      setSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="carForm">
      <div className="inputBox">
        <label htmlFor="name">NAME  </label>
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
        <label htmlFor="year">YEAR  </label>
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
        <label htmlFor="chassisNumber">CHASSIS   </label>
        <input
          className="typeHere"
          type="text"
          name="chassisNumber"
          id="chassisNumber"
          placeholder="Chassis number..."
          value={form.chassisNumber}
          onChange={handleChange}
          required
          disabled={submitting}
        />
      </div>
      <div className="inputBox">
        <label htmlFor="image">IMAGE  </label>
        <input
          className="typeHere"
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleChange}
          disabled={submitting}
        />
      </div>
      <button className="button" type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Create"}
      </button>
    </form>
  );
}