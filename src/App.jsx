import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Hub from './components/Hub';
import RPS from './components/RPS';
import TicTacToe from './components/TicTacToe';
import Wordle from './components/Wordle';
import MemoryCards from './components/MemoryCards';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const settings = localStorage.getItem('game.settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setPlayerName(parsed.playerName || '');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hub setPlayerName={setPlayerName} />} />
        <Route path="/rps" element={<RPS playerName={playerName} />} />
        <Route path="/tictactoe" element={<TicTacToe playerName={playerName} />} />
        <Route path="/wordle" element={<Wordle playerName={playerName} />} />
        <Route path="/memory" element={<MemoryCards playerName={playerName} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
