
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import LogMinyan from './pages/LogMinyan';
import Album from './pages/Album';
import Stats from './pages/Stats';
import History from './pages/History';
import Settings from './pages/Settings';

function NavBar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <nav>
      <Link to="/" className={isActive('/')}>Log Minyan</Link>
      <Link to="/stats" className={isActive('/stats')}>Stats</Link>
      <Link to="/history" className={isActive('/history')}>History</Link>
      <Link to="/album" className={isActive('/album')}>Album</Link>
      <Link to="/settings" className={isActive('/settings')}>Settings</Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="container">
        <h1>Minyan Tracker</h1>
        <NavBar />
        <Routes>
          <Route path="/" element={<LogMinyan />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/history" element={<History />} />
          <Route path="/album" element={<Album />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
