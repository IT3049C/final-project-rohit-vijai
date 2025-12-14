import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { loadSettings } from './utils/settings';
import Hub from './components/Hub.jsx';
import Navigation from './components/Navigation.jsx';
import RockPaperScissors from './components/RockPaperScissors.jsx';
import TicTacToe from './components/TicTacToe.jsx';
import Wordle from './components/Wordle.jsx';
import MemoryCards from './components/MemoryCards.jsx';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const settings = loadSettings();
    if (settings?.name) {
      setPlayerName(settings.name);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation playerName={playerName} />
        <Routes>
          <Route path="/" element={<Hub setPlayerName={setPlayerName} />} />
          <Route path="/rps" element={<RockPaperScissors playerName={playerName} />} />
          <Route path="/tictactoe" element={<TicTacToe playerName={playerName} />} />
          <Route path="/wordle" element={<Wordle playerName={playerName} />} />
          <Route path="/memory" element={<MemoryCards playerName={playerName} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;