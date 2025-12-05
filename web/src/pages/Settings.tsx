import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [profile, setProfile] = useState<any>({});
  const [shuls, setShuls] = useState<any[]>([]);
  const [newShul, setNewShul] = useState({ name: '', area: '', address: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(setProfile);
    fetch('/api/shuls').then(r => r.json()).then(setShuls);
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/profile', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(profile)
    });
    setMessage('Profile saved.');
  };

  const handleAddShul = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/shuls', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newShul)
    });
    if (res.ok) {
        const shul = await res.json();
        setShuls([...shuls, shul]);
        setNewShul({ name: '', area: '', address: '' });
    }
  };

  const handleDeleteShul = async (id: string) => {
      if(!confirm('Delete shul?')) return;
      await fetch(`/api/shuls/${id}`, { method: 'DELETE' });
      setShuls(shuls.filter(s => s.id !== id));
  };

  return (
    <div>
      <div className="card">
        <h2>Profile Settings</h2>
        {message && <p style={{color: 'green'}}>{message}</p>}
        <form onSubmit={handleProfileSave}>
            <div className="form-group">
                <label>Name</label>
                <input
                    value={profile.name || ''}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                />
            </div>
            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        checked={profile.travelMode || false}
                        onChange={e => setProfile({...profile, travelMode: e.target.checked})}
                    /> Travel Mode
                </label>
            </div>
            <button type="submit">Save Profile</button>
        </form>
      </div>

      <div className="card">
        <h2>Manage Shuls</h2>
        <ul style={{listStyle: 'none', padding: 0}}>
            {shuls.map(shul => (
                <li key={shul.id} style={{marginBottom: 10, display: 'flex', justifyContent: 'space-between'}}>
                    <span>{shul.name} ({shul.area})</span>
                    <button onClick={() => handleDeleteShul(shul.id)} style={{background: '#cc0000', padding: '2px 5px', fontSize: '12px'}}>Delete</button>
                </li>
            ))}
        </ul>
        <h3>Add Shul</h3>
        <form onSubmit={handleAddShul}>
            <div className="form-group">
                <input placeholder="Name" value={newShul.name} onChange={e => setNewShul({...newShul, name: e.target.value})} required />
            </div>
            <div className="form-group">
                <input placeholder="Area" value={newShul.area} onChange={e => setNewShul({...newShul, area: e.target.value})} required />
            </div>
            <div className="form-group">
                <input placeholder="Address" value={newShul.address} onChange={e => setNewShul({...newShul, address: e.target.value})} />
            </div>
            <button type="submit">Add Shul</button>
        </form>
      </div>
    </div>
  );
}
