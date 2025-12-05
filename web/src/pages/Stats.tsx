import { useState, useEffect } from 'react';

export default function Stats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div>
      <div className="card">
        <h2>Statistics</h2>
        <div className="stat-grid">
            <div className="stat-item">
                <div className="stat-value">{stats.totalMinyanim}</div>
                <div>Total Minyanim</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">{stats.streak}</div>
                <div>Current Streak</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">{stats.bestStreak}</div>
                <div>Best Streak</div>
            </div>
             <div className="stat-item">
                <div className="stat-value">{stats.level}</div>
                <div>Level</div>
            </div>
        </div>
      </div>

      <div className="card">
        <h3>Prayer Breakdown</h3>
        <div className="stat-grid">
            <div className="stat-item">
                <div className="stat-value">{stats.perPrayer.Shacharit}</div>
                <div>Shacharit</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">{stats.perPrayer.Mincha}</div>
                <div>Mincha</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">{stats.perPrayer.Maariv}</div>
                <div>Maariv</div>
            </div>
        </div>
      </div>

      <div className="card">
        <h3>Badges</h3>
        <div className="badge-grid">
            {stats.badges.map((badge: any) => (
                <div key={badge.id} className="badge">
                    <strong>{badge.title}</strong>
                    <p>{badge.description}</p>
                </div>
            ))}
            {stats.badges.length === 0 && <p>No badges yet. Keep going!</p>}
        </div>
      </div>
    </div>
  );
}
