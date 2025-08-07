import React, { useState } from 'react';

interface HistoryFormProps {
  carId: string;
  onHistoryAdded: () => Promise<void>;
}

const HistoryForm: React.FC<HistoryFormProps> = ({ carId, onHistoryAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`http://localhost:5001/cars/${carId}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, date }),
    });

    setTitle('');
    setDescription('');
    setDate('');

    await onHistoryAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <input
        type="date"
        aria-label="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      <button type="submit">Add History</button>
    </form>
  );
};

export default HistoryForm;
