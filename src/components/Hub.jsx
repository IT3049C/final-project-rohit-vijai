import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveSettings, loadSettings } from '../utils/settings';
import { avatars } from '../utils/avatars';
import './Hub.css';

export default function Hub({ setPlayerName }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('wizard');
  const [difficulty, setDifficulty] = useState('normal');
  const [darkMode, setDarkMode] = useState(false);
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const settings = loadSettings();
    if (settings) {
      setName(settings.name || '');
      setAvatar(settings.avatar || 'wizard');
      setDifficulty(settings.difficulty || 'normal');
      setDarkMode(settings.darkMode || false);
      setGreeting(`Welcome back, ${settings.name}!`);
      setPlayerName(settings.name);
      document.body.classList.toggle('theme-dark', settings.darkMode);
    }
  }, [setPlayerName]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || name.length < 2) {
      alert('Please enter a name (2-15 characters)');
      return;
    }
    if (!avatar) {
      alert('Please select an avatar');
      return;
    }

    const settings = { name, avatar, difficulty, darkMode };
    saveSettings(settings);
    setGreeting(`Welcome, ${name}!`);
    setPlayerName(name);
    document.body.classList.toggle('theme-dark', darkMode);
  };

  const games = [
    { title: 'Rock Paper Scissors', path: '/rps', description: 'Classic hand game' },
    { title: 'Tic Tac Toe', path: '/tictactoe', description: 'X and O strategy' },
    { title: 'Wordle', path: '/wordle', description: 'Guess the word' },
    { title: 'Memory Cards', path: '/memory', description: 'Multiplayer matching' }
  ];

  return (
    <main className={`hub ${darkMode ? 'theme-dark' : ''}`}>
      <h1>🎮 Game Hub</h1>
      <p className="developer">Developer: Your Name</p>

      <section className="player-setup">
        <h2>Player Setup</h2>
        <form id="settings-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="player-name">Player Name</label>
            <input
              type="text"
              id="player-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={15}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Choose Avatar</label>
            <div className="avatar-options">
              {avatars.map((av) => (
                <label key={av.key} className="avatar-option">
                  <input
                    type="radio"
                    name="avatar"
                    value={av.key}
                    checked={avatar === av.key}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                  <img src={av.image} alt={av.key} />
                  <span>{av.key}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                id="theme-toggle"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              Dark Mode
            </label>
          </div>

          <button type="submit" id="save-settings">Save Settings</button>
        </form>

        {greeting && (
          <p data-testid="greeting" className="greeting">
            {greeting}
          </p>
        )}
      </section>

      <section className="games-list">
        <h2>Available Games</h2>
        <div className="game-cards">
          {games.map((game) => (
            <div key={game.path} className="game-card">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <button
                onClick={() => navigate(game.path)}
                disabled={!name}
                role="button"
                aria-label={`Play ${game.title}`}
              >
                {name ? 'Play' : 'Setup Profile First'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}