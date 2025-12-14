import { useState, useEffect } from 'react';
import './Wordle.css';

const WORD_LIST = ['REACT', 'GAMES', 'WORDS', 'BRAIN', 'QUICK', 'LIGHT', 'THEME', 'PROPS', 'STATE', 'HOOKS'];
const MAX_ATTEMPTS = 6;

export default function Wordle({ playerName }) {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
  };

  const checkGuess = (guess) => {
    return guess.split('').map((letter, idx) => {
      if (letter === targetWord[idx]) return 'correct';
      if (targetWord.includes(letter)) return 'present';
      return 'absent';
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentGuess.length !== 5) {
      alert('Word must be 5 letters');
      return;
    }

    const result = checkGuess(currentGuess.toUpperCase());
    const newGuesses = [...guesses, { word: currentGuess.toUpperCase(), result }];
    setGuesses(newGuesses);

    if (currentGuess.toUpperCase() === targetWord) {
      setGameStatus('won');
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus('lost');
    }

    setCurrentGuess('');
  };

  return (
    <div className="game-container">
      <a href="/" role="link" aria-label="Home">← Back to Hub</a>
      
      <h1>Wordle</h1>
      
      <div data-testid="player-name" className="player-greeting">
        Welcome, {playerName}!
      </div>
      
      <p>Guess the 5-letter word!</p>

      <div className="attempts-left">{guesses.length} / {MAX_ATTEMPTS}</div>

      {gameStatus === 'won' && <div className="message">🎉 You won!</div>}
      {gameStatus === 'lost' && <div className="message">😢 Word was: {targetWord}</div>}

      <div className="guesses">
        {guesses.map((guess, i) => (
          <div key={i} className="guess-row">
            {guess.word.split('').map((letter, j) => (
              <span key={j} className={`letter ${guess.result[j]}`}>
                {letter}
              </span>
            ))}
          </div>
        ))}
        {gameStatus === 'playing' && (
          <div className="guess-row current">
            {currentGuess.split('').map((letter, i) => (
              <span key={i} className="letter">{letter}</span>
            ))}
            {Array(5 - currentGuess.length).fill('').map((_, i) => (
              <span key={i + currentGuess.length} className="letter empty"></span>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          id="guess-input"
          type="text"
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value.toUpperCase().slice(0, 5))}
          maxLength={5}
          disabled={gameStatus !== 'playing'}
          placeholder="Enter your guess"
          aria-label="Enter your guess"
        />
        <button type="submit" disabled={gameStatus !== 'playing'}>
          Submit Guess
        </button>
      </form>

      <button id="reset-game" onClick={resetGame}>Reset Game</button>
    </div>
  );
}
