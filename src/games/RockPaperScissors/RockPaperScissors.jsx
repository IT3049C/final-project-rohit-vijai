import { useState, useEffect } from 'react';
import { loadSettings } from '../../utils/settings';
import { decideWinner, getCpuMove, nextScore } from './game';
import './RPS.css';

export default function RockPaperScissors({ playerName }) {
  const [score, setScore] = useState({ player: 0, cpu: 0, ties: 0 });
  const [history, setHistory] = useState([]);
  const [lastPlayerMove, setLastPlayerMove] = useState(null);
  const [difficulty, setDifficulty] = useState('normal');

  useEffect(() => {
    const settings = loadSettings();
    if (settings?.difficulty) {
      setDifficulty(settings.difficulty);
    }
  }, []);

  const handleMove = (playerMove) => {
    const cpuMove = getCpuMove({ difficulty, lastPlayerMove });
    const outcome = decideWinner(playerMove, cpuMove);
    
    setScore(prev => nextScore(prev, outcome));
    setHistory(prev => [
      { player: playerMove, cpu: cpuMove, outcome },
      ...prev
    ]);
    setLastPlayerMove(playerMove);
  };

  const handleReset = () => {
    setScore({ player: 0, cpu: 0, ties: 0 });
    setHistory([]);
    setLastPlayerMove(null);
  };

  return (
    <div className="rps-game">
      <div data-testid="greeting" className="player-greeting">
        Hello, {playerName || 'Player'}!
      </div>
      
      <h1>Rock Paper Scissors</h1>
      
      <div className="difficulty-display">
        Difficulty: <span id="current-difficulty">{difficulty}</span>
      </div>

      <div className="scoreboard">
        <div className="score-item">
          <span>Player</span>
          <span id="score-player">{score.player}</span>
        </div>
        <div className="score-item">
          <span>CPU</span>
          <span id="score-cpu">{score.cpu}</span>
        </div>
        <div className="score-item">
          <span>Ties</span>
          <span id="score-ties">{score.ties}</span>
        </div>
      </div>

      <div className="move-buttons">
        <button
          onClick={() => handleMove('rock')}
          data-move="rock"
          role="button"
          aria-label="Choose Rock"
        >
          🪨 Rock
        </button>
        <button
          onClick={() => handleMove('paper')}
          data-move="paper"
          role="button"
          aria-label="Choose Paper"
        >
          📄 Paper
        </button>
        <button
          onClick={() => handleMove('scissors')}
          data-move="scissors"
          role="button"
          aria-label="Choose Scissors"
        >
          ✂️ Scissors
        </button>
      </div>

      <button onClick={handleReset} id="reset-game" className="reset-btn">
        Reset Game
      </button>

      <div className="history">
        <h3>History</h3>
        <ul id="history">
          {history.map((round, idx) => (
            <li key={idx}>
              Player({round.player}) vs CPU({round.cpu}) - {round.outcome === 'tie' ? 'Tie' : `${round.outcome} wins`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
