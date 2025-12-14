import { useState, useEffect } from 'react';
import './Wordle.css';

const WORD_LIST = ['REACT', 'GAMES', 'WORDS', 'BRAIN', 'QUICK', 'LIGHT', 'THEME', 'PROPS', 'STATE', 'HOOKS'];
const MAX_ATTEMPTS = 6;

export default function Wordle({ playerName }) {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost

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
    <div className="wordle-game">
      <div data-testid="greeting" className="player-greeting">
        Hello, {playerName || 'Player'}!
      </div>
      
      <h1>Wordle</h1>

      <div className="game-info">
        <p>Guess the 5-letter word!</p>
        {gameStatus === 'won' && <p className="status-won">🎉 You won!</p>}
        {gameStatus === 'lost' && <p className="status-lost">😢 Word was: {targetWord}</p>}
      </div>

      <div className="guesses-container" role="list">
        {guesses.map((guess, idx) => (
          <div key={idx} className="guess-row" role="listitem">
            {guess.word.split('').map((letter, letterIdx) => (
              <span
                key={letterIdx}
                className={`letter ${guess.result[letterIdx]}`}
              >
                {letter}
              </span>
            ))}
          </div>
        ))}
        
        {guesses.length < MAX_ATTEMPTS && gameStatus === 'playing' && (
          <div className="guess-row current">
            {Array(5).fill('').map((_, idx) => (
              <span key={idx} className="letter empty">
                {currentGuess[idx] || ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {gameStatus === 'playing' && (
        <form onSubmit={handleSubmit} className="guess-form">
          <input
            type="text"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
            maxLength={5}
            placeholder="Enter word"
            id="guess-input"
            role="textbox"
            aria-label="Enter your guess"
          />
          <button type="submit" role="button" aria-label="Submit guess">
            Submit
          </button>
        </form>
      )}

      <button onClick={resetGame} id="reset-game" className="reset-btn">
        New Game
      </button>

      <div className="attempts-left">
        Attempts: {guesses.length} / {MAX_ATTEMPTS}
      </div>
    </div>
  );
}
