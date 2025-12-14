import { Link } from 'react-router-dom';
import './Navigation.css';

export default function Navigation({ playerName }) {
  return (
    <nav className="main-nav">
      <Link to="/" className="nav-brand">
        🎮 Game Hub
      </Link>
      {playerName && (
        <span className="player-display" data-testid="player-name">
          👤 {playerName}
        </span>
      )}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/rps">RPS</Link>
        <Link to="/tictactoe">Tic Tac Toe</Link>
        <Link to="/wordle">Wordle</Link>
        <Link to="/memory">Memory</Link>
      </div>
    </nav>
  );
}