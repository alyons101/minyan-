import { useState, useEffect } from 'react';

export default function Album() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/minyan-logs')
      .then(res => res.json())
      .then(data => {
        // Filter for logs with photos
        setLogs(data.filter((l: any) => l.photoUri && l.photoUri.trim() !== ''));
      })
      .catch(console.error);
  }, []);

  return (
    <div className="card">
      <h2>Album</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px'}}>
        {logs.map(log => (
            <div key={log.id} style={{border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden'}}>
                <img
                    src={log.photoUri}
                    alt="Minyan"
                    style={{width: '100%', height: '150px', objectFit: 'cover'}}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Error'; }}
                />
                <div style={{padding: '10px'}}>
                    <strong>{log.prayerType}</strong><br/>
                    <small>{new Date(log.date).toLocaleDateString()}</small><br/>
                    <small>{log.shulName}</small>
                </div>
            </div>
        ))}
        {logs.length === 0 && <p>No photos yet.</p>}
      </div>
    </div>
  );
}
