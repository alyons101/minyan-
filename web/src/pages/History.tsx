import { useState, useEffect } from 'react';

export default function History() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/minyan-logs')
      .then(res => res.json())
      .then(setLogs)
      .catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
        await fetch(`/api/minyan-logs/${id}`, { method: 'DELETE' });
        setLogs(logs.filter(l => l.id !== id));
    } catch (e) {
        alert('Failed to delete');
    }
  };

  return (
    <div className="card">
      <h2>History</h2>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
            <tr style={{textAlign: 'left'}}>
                <th>Date</th>
                <th>Prayer</th>
                <th>Shul</th>
                <th>Notes</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {logs.map(log => (
                <tr key={log.id} style={{borderBottom: '1px solid #eee'}}>
                    <td style={{padding: '10px 0'}}>
                        {new Date(log.date).toLocaleDateString()} {new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td>{log.prayerType}</td>
                    <td>{log.shulName}</td>
                    <td>{log.note}</td>
                    <td>
                        <button
                            onClick={() => handleDelete(log.id)}
                            style={{padding: '5px', fontSize: '12px', background: '#cc0000'}}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={5}>No logs found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
