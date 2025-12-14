import { useState, useEffect, useCallback } from 'react';
import { createRoom, getRoom, updateRoom, joinRoom } from '../gameRoomAPI';
import './MemoryCards.css';

const EMOJIS = ['🎮', '🎯', '🎲', '🎨', '🎭', '🎪', '🎸', '🎺'];

export default function MemoryCards({ playerName }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [roomId, setRoomId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [error, setError] = useState('');
  const [isHost, setIsHost] = useState(false);

  const initializeGame = useCallback(() => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji, matched: false }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    return shuffled;
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
      if (isMultiplayer && roomId) {
        updateRoom(roomId, {
          cards,
          moves,
          matched,
          gameWon: true
        }).catch(err => console.error('Failed to update room:', err));
      }
    }
  }, [matched, cards, isMultiplayer, roomId, moves]);

  useEffect(() => {
    if (!isMultiplayer || !roomId || isHost) return;

    const interval = setInterval(async () => {
      try {
        const room = await getRoom(roomId);
        const state = room.gameState;
        
        if (state.cards) setCards(state.cards);
        if (state.matched) setMatched(state.matched);
        if (state.moves !== undefined) setMoves(state.moves);
        if (state.gameWon) setGameWon(true);
      } catch (err) {
        console.error('Failed to fetch room updates:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isMultiplayer, roomId, isHost]);

  const handleCardClick = async (cardId) => {
    if (flipped.length === 2 || flipped.includes(cardId) || matched.includes(cardId)) {
      return;
    }

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const newMoves = moves + 1;
      setMoves(newMoves);
      
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard.emoji === secondCard.emoji) {
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        setFlipped([]);
        
        if (isMultiplayer && roomId) {
          try {
            await updateRoom(roomId, {
              cards,
              moves: newMoves,
              matched: newMatched,
              gameWon: newMatched.length === cards.length
            });
          } catch (err) {
            console.error('Failed to update room:', err);
          }
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          
          if (isMultiplayer && roomId) {
            updateRoom(roomId, {
              cards,
              moves: newMoves,
              matched,
              gameWon: false
            }).catch(err => console.error('Failed to update room:', err));
          }
        }, 1000);
      }
    }
  };

  const createMultiplayerRoom = async () => {
    setError('');
    try {
      const shuffledCards = initializeGame();
      const room = await createRoom('memory-cards', { 
        cards: shuffledCards, 
        moves: 0, 
        matched: [],
        gameWon: false,
        host: playerName || 'Player 1'
      });
      
      setRoomId(room.id);
      setIsMultiplayer(true);
      setIsHost(true);
      alert(`Room created! Share this code with friends: ${room.id}`);
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
      
      if (state.cards) setCards(state.cards);
      if (state.matched) setMatched(state.matched);
      if (state.moves !== undefined) setMoves(state.moves);
      if (state.gameWon) setGameWon(state.gameWon);
      
      setJoinCode('');
      alert(`Joined room ${room.id}!`);
    } catch (err) {
      setError('Room not found. Please check the code and try again.');
      console.error(err);
    }
  };

  const handleReset = () => {
    initializeGame();
    setRoomId('');
    setIsMultiplayer(false);
    setIsHost(false);
    setJoinCode('');
    setError('');
  };

  return (
    <div className="memory-game">
      <a href="/" role="link" aria-label="Home">← Back to Hub</a>
      
      <div data-testid="player-name" className="player-greeting">
        Hello, {playerName || 'Player'}!
      </div>
      
      <h1>Memory Cards</h1>

      <div className="game-info">
        <span>Moves: <span id="move-count">{moves}</span></span>
        {gameWon && <span className="won-message">🎉 You won!</span>}
      </div>

      {!isMultiplayer && (
        <div className="multiplayer-controls">
          <button 
            onClick={createMultiplayerRoom} 
            role="button" 
            aria-label="Create multiplayer room"
          >
            Create Multiplayer Room
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
            <button 
              onClick={handleJoinRoom}
              role="button"
              aria-label="Join room"
            >
              Join Room
            </button>
          </div>
        </div>
      )}

      {isMultiplayer && (
        <div className="room-info">
          <p>
            <strong>Room Code:</strong> {roomId} 
            {isHost && ' (You are the host)'}
          </p>
        </div>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="cards-grid" role="grid">
        {cards.map((card) => (
          <button
            key={card.id}
            className={`card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
            disabled={flipped.includes(card.id) || matched.includes(card.id)}
            data-card={card.id}
            role="gridcell"
            aria-label={`Card ${card.id}`}
          >
            {flipped.includes(card.id) || matched.includes(card.id) ? card.emoji : '?'}
          </button>
        ))}
      </div>

      <button onClick={handleReset} id="reset-game" className="reset-btn">
        {isMultiplayer ? 'Leave & Reset Game' : 'Reset Game'}
      </button>
    </div>
  );
}
