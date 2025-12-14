import { useState } from 'react';
import './TicTacToe.css';

export default function TicTacToe({ playerName }) {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setWinner(null);
  };

  return (
    <div className="game-container">
      <a href="/" role="link" aria-label="Home">← Back to Hub</a>
      
      <h1>Tic Tac Toe</h1>
      
      <div data-testid="player-name" className="player-greeting">
        Welcome, {playerName}!
      </div>
      
      <div>Current Player: <span id="current-player">{currentPlayer}</span></div>
      {winner && <div className="winner">Winner: {winner}</div>}

      <div className="board">
        {board.map((cell, i) => (
          <div
            key={i}
            className="cell"
            data-cell={i}
            onClick={() => handleClick(i)}
          >
            {cell}
          </div>
        ))}
      </div>

      <button id="reset-game" onClick={reset}>Reset Game</button>
    </div>
  );
}
