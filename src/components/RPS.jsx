import { useState } from 'react';
import './RPS.css';

const moves = ['rock', 'paper', 'scissors'];
const beats = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

export default function RPS({ playerName }) {
  const [scores, setScores] = useState({ player: 0, cpu: 0, ties: 0 });
  const [history, setHistory] = useState([]);

  const play = (playerMove) => {
    const cpuMove = moves[Math.floor(Math.random() * moves.length)];
    let result;
    
    if (playerMove === cpuMove) {
      result = 'tie';
      setScores(s => ({ ...s, ties: s.ties + 1 }));
    } else if (beats[playerMove] === cpuMove) {
      result = 'win';
      setScores(s => ({ ...s, player: s.player + 1 }));
    } else {
      result = 'lose';
      setScores(s => ({ ...s, cpu: s.cpu + 1 }));
    }

    setHistory(h => [...h, { playerMove, cpuMove, result }]);
  };

  const reset = () => {
    setScores({ player: 0, cpu: 0, ties: 0 });
    setHistory([]);
  };

  return (
    <div className="game-container">
      <a href="/" role="link" aria-label="Home">← Back to Hub</a>
      
      <h1>Rock Paper Scissors</h1>
      
      <div data-testid="player-name" className="player-greeting">
        Welcome, {playerName}!
      </div>

      <div className="scores">
        <div>Player: <span id="score-player">{scores.player}</span></div>
        <div>CPU: <span id="score-cpu">{scores.cpu}</span></div>
        <div>Ties: <span id="score-ties">{scores.ties}</span></div>
      </div>

      <div className="moves">
        <button data-move="rock" onClick={() => play('rock')}>Rock</button>
        <button data-move="paper" onClick={() => play('paper')}>Paper</button>
        <button data-move="scissors" onClick={() => play('scissors')}>Scissors</button>
      </div>

      <button id="reset-game" onClick={reset}>Reset Game</button>

      <ul id="history">
        {history.map((round, i) => (
          <li key={i}>
            {round.playerMove} vs {round.cpuMove} - {round.result}
          </li>
        ))}
      </ul>
    </div>
  );
}
