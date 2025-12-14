import { useState, useEffect, useCallback } from 'react';
import { createRoom, getRoom, updateRoom, joinRoom } from '../utils/gameRoomAPI';
import './TicTacToe.css';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

export default function TicTacToe({ playerName }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [mySymbol, setMySymbol] = useState('');
  const [error, setError] = useState('');

  const calculateWinner = useCallback((squares) => {
    for (let combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }, []);

  useEffect(() => {
    const win = calculateWinner(board);
    if (win) {
      setWinner(win);
      if (isMultiplayer && roomId) {
        updateRoom(roomId, { board, isXNext, winner: win })
          .catch(err => console.error('Failed to update room:', err));
      }
    } else if (board.every(cell => cell !== null)) {
      setWinner('draw');
      if (isMultiplayer && roomId) {
        updateRoom(roomId, { board, isXNext, winner: 'draw' })
          .catch(err => console.error('Failed to update room:', err));
      }
    }
  }, [board, calculateWinner, isMultiplayer, roomId, isXNext]);

  // Poll for updates in multiplayer mode
  useEffect(() => {
    if (!isMultiplayer || !roomId) return;

    const interval = setInterval(async () => {
      try {
        const room = await getRoom(roomId);
        const state = room.gameState;
        
        if (state.board) setBoard(state.board);
        if (state.isXNext !== undefined) setIsXNext(state.isXNext);
        if (state.winner !== undefined) setWinner(state.winner);
      } catch (err) {
        console.error('Failed to fetch room updates:', err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isMultiplayer, roomId]);

  const handleClick = async (index) => {
    if (board[index] || winner) return;
    
    // In multiplayer, check if it's player's turn
    if (isMultiplayer) {
      const currentSymbol = isXNext ? 'X' : 'O';
      if (currentSymbol !== mySymbol) {
        alert("It's not your turn!");
        return;
      }
    }
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    // Update multiplayer room
    if (isMultiplayer && roomId) {
      try {
        await updateRoom(roomId, {
          board: newBoard,
          isXNext: !isXNext,
          winner: calculateWinner(newBoard)
        });
      } catch (err) {
        console.error('Failed to update room:', err);
      }
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    
    if (isMultiplayer && roomId) {
      updateRoom(roomId, {
        board: Array(9).fill(null),
        isXNext: true,
        winner: null
      }).catch(err => console.error('Failed to update room:', err));
    }
  };

  const createMultiplayerRoom = async () => {
    setError('');
    try {
      const room = await createRoom('tic-tac-toe', {
        board: Array(9).fill(null),
        isXNext: true,
        winner: null,
        host: playerName || 'Player 1'
      });
      
      setRoomId(room.id);
      setIsMultiplayer(true);
      setIsHost(true);
      setMySymbol('X');
      alert(`Room created! Share this code: ${room.id}\nYou are X. Your opponent will be O.`);
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error(err);
    }
  };

  const handleJoinRoom = async () => {
    setError('');
    if (!joinCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    try {
      const room = await joinRoom(joinCode.toUpperCase().trim());
      const state = room.gameState;
      
      setRoomId(room.id);
      setIsMultiplayer(true);
      setIsHost(false);
      setMySymbol('O');
      
      if (state.board) setBoard(state.board);
      if (state.isXNext !== undefined) setIsXNext(state.isXNext);
      if (state.winner !== undefined) setWinner(state.winner);
      
      setJoinCode('');
      alert(`Joined room ${room.id}!\nYou are O. Wait for X to make the first move.`);
    } catch (err) {
      setError('Room not found. Please check the code and try again.');
      console.error(err);
    }
  };

  const leaveRoom = () => {
    setRoomId('');
    setIsMultiplayer(false);
    setIsHost(false);
    setMySymbol('');
    setJoinCode('');
    setError('');
    handleReset();
  };

  return (
    <div className="tictactoe-game">
      <div data-testid="greeting" className="player-greeting">
        Hello, {playerName || 'Player'}!
      </div>
      
      <h1>Tic Tac Toe</h1>

      {!isMultiplayer && (
        <div className="multiplayer-controls">
          <button 
            onClick={createMultiplayerRoom}
            className="multiplayer-btn"
          >
            Create Multiplayer Game
          </button>
          
          <div className="join-room">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter room code"
              maxLength={6}
              aria-label="Room code input"
            />
            <button onClick={handleJoinRoom}>
              Join Game
            </button>
          </div>
        </div>
      )}

      {isMultiplayer && (
        <div className="room-info">
          <p>
            <strong>Room:</strong> {roomId} | <strong>You are:</strong> {mySymbol}
          </p>
        </div>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="game-status">
        {winner === 'draw' ? (
          <span>It's a draw!</span>
        ) : winner ? (
          <span id="game-winner">{winner} wins!</span>
        ) : (
          <span id="current-player">
            Current: {isXNext ? 'X' : 'O'}
            {isMultiplayer && mySymbol && (
              <span className={mySymbol === (isXNext ? 'X' : 'O') ? 'your-turn' : 'waiting'}>
                {mySymbol === (isXNext ? 'X' : 'O') ? ' (Your turn!)' : ' (Waiting...)'}
              </span>
            )}
          </span>
        )}
      </div>

      <div className="board" role="grid">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className="cell"
            onClick={() => handleClick(idx)}
            disabled={!!cell || !!winner}
            data-cell={idx}
            role="gridcell"
            aria-label={`Cell ${idx}`}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="game-controls">
        <button onClick={handleReset} id="reset-game" className="reset-btn">
          {isMultiplayer ? 'Reset Game' : 'Reset Game'}
        </button>
        
        {isMultiplayer && (
          <button onClick={leaveRoom} className="leave-btn">
            Leave Room
          </button>
        )}
      </div>
    </div>
  );
}