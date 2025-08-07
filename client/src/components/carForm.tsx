import { useState } from 'react';

interface CarFormData {
  name: string;
  year: string;
  chassisNumber: string;
  image: File | null;
}

interface AddCarResult {
  success: boolean;
  message?: string;
}

interface CarFormProps {
  onAddCar: (formData: FormData) => Promise<AddCarResult>;
}

export default function CarForm({ onAddCar }: CarFormProps) {
  const [form, setForm] = useState<CarFormData>({
    name: '',
    year: '',
    chassisNumber: '',
    image: null,
  });

  const [submitting, setSubmitting] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === 'image' && e.target.files) {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      <h2>Add a new car</h2>
      <p>To start adding events to your car, add it here.</p>

      <label>
        Name
        <div className="inputBox">
          <input
            className="typeHere"
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
      </label>

      <label>
        Build year
        <div className="inputBox">
          <input
            className="typeHere"
            type="number"
            name="year"
            id="year"
            value={form.year}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
      </label>

      <label>
        Chassis number
        <div className="inputBox">
          <input
            className="typeHere"
            type="text"
            name="chassisNumber"
            id="chassisNumber"
            value={form.chassisNumber}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
      </label>

      <label>
        Image
        <div className="inputBox">
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
      </label>

      <button className="button" type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Create'}
      </button>
    </form>
  );
}