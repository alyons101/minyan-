import React, { useState, useEffect } from 'react';

interface Shul {
  id: string;
  name: string;
  area: string;
}

export default function LogMinyan() {
  const [shuls, setShuls] = useState<Shul[]>([]);
  const [formData, setFormData] = useState({
    prayer: 'Shacharit',
    shulId: '',
    notes: '',
    travelArea: '',
    timestamp: '',
    photoUri: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/shuls')
      .then(res => res.json())
      .then(data => {
        setShuls(data);
        if (data.length > 0) {
            setFormData(prev => ({...prev, shulId: data[0].id}));
        }
      })
      .catch(err => console.error('Failed to load shuls', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const selectedShul = shuls.find(s => s.id === formData.shulId);
      const payload = {
          ...formData,
          shulName: selectedShul ? selectedShul.name : 'Unknown'
      };

      const res = await fetch('/api/minyan-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setMessage('Minyan logged successfully!');
        setFormData(prev => ({ ...prev, notes: '', photoUri: '', travelArea: '' }));
      } else {
        setMessage('Error logging minyan.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Log Minyan</h2>
      {message && <div style={{marginBottom: 10, color: message.includes('Error') ? 'red' : 'green'}}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Prayer</label>
          <select
            value={formData.prayer}
            onChange={e => setFormData({...formData, prayer: e.target.value})}
          >
            <option value="Shacharit">Shacharit</option>
            <option value="Mincha">Mincha</option>
            <option value="Maariv">Maariv</option>
          </select>
        </div>

        <div className="form-group">
          <label>Shul</label>
          <select
            value={formData.shulId}
            onChange={e => setFormData({...formData, shulId: e.target.value})}
          >
            {shuls.map(shul => (
              <option key={shul.id} value={shul.id}>{shul.name} ({shul.area})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date/Time (Optional)</label>
          <input
            type="datetime-local"
            value={formData.timestamp}
            onChange={e => setFormData({...formData, timestamp: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <div className="form-group">
            <label>Travel Area (Optional)</label>
            <input
                type="text"
                value={formData.travelArea}
                onChange={e => setFormData({...formData, travelArea: e.target.value})}
            />
        </div>

        <div className="form-group">
            <label>Photo URL (Optional)</label>
            <input
                type="text"
                value={formData.photoUri}
                placeholder="https://..."
                onChange={e => setFormData({...formData, photoUri: e.target.value})}
            />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Log Minyan'}
        </button>
      </form>
    </div>
  );
}
