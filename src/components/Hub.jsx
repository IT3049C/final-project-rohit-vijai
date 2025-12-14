import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hub.css';

export default function Hub({ setPlayerName }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('wizard');
  const navigate = useNavigate();

  useEffect(() => {
    const settings = localStorage.getItem('game.settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setName(parsed.playerName || '');
      setAvatar(parsed.avatar || 'wizard');
    }
  }, []);

  const handleSave = () => {
    const settings = { playerName: name, avatar };
    localStorage.setItem('game.settings', JSON.stringify(settings));
    setPlayerName(name);
  };

  return (
    <div className="hub-container">
      <h1>Game Hub</h1>
      
      <div className="developer">
        <p>Developed by Rohit Vijai</p>
      </div>

      <div data-testid="greeting" className="player-greeting">
        {name && `Hello, ${name}!`}
      </div>
      
      <div className="player-setup">
        <label htmlFor="player-name">Player Name:</label>
        <input
          id="player-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <div className="avatar-selection">
          <label className="avatar-option">
            <input
              type="radio"
              name="avatar"
              value="wizard"
              checked={avatar === 'wizard'}
              onChange={(e) => setAvatar(e.target.value)}
            />
            Wizard
          </label>
          <label className="avatar-option">
            <input
              type="radio"
              name="avatar"
              value="knight"
              checked={avatar === 'knight'}
              onChange={(e) => setAvatar(e.target.value)}
            />
            Knight
          </label>
          <label className="avatar-option">
            <input
              type="radio"
              name="avatar"
              value="rogue"
              checked={avatar === 'rogue'}
              onChange={(e) => setAvatar(e.target.value)}
            />
            Rogue
          </label>
        </div>

        <button id="save-settings" onClick={handleSave}>
          Save Settings
        </button>
      </div>

      <div className="games-grid">
        <button 
          className="game-card" 
          onClick={() => navigate('/rps')}
          role="button"
          aria-label="Play Rock Paper Scissors"
        >
          <h2>Rock Paper Scissors</h2>
          <p>Classic hand game</p>
        </button>
        
        <button 
          className="game-card" 
          onClick={() => navigate('/tictactoe')}
          role="button"
          aria-label="Play Tic Tac Toe"
        >
          <h2>Tic Tac Toe</h2>
          <p>Three in a row wins</p>
        </button>
        
        <button 
          className="game-card" 
          onClick={() => navigate('/wordle')}
          role="button"
          aria-label="Play Wordle"
        >
          <h2>Wordle</h2>
          <p>Guess the 5-letter word</p>
        </button>
        
        <button 
          className="game-card" 
          onClick={() => navigate('/memory')}
          role="button"
          aria-label="Play Memory"
        >
          <h2>Memory Cards</h2>
          <p>Match pairs to win</p>
        </button>
      </div>
    </div>
  );
}
