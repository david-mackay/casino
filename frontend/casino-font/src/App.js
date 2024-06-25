// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Minesweeper from './Minesweeper';
import RouletteTable from './RouletteTable';
import SlotMachine from './SlotMachine';
import PokerGame from './PokerGame';
import './App.css';

function App() {
  const [balance, setBalance] = useState(500);

  return (
    <Router>
      <div>
        <h1>Casino Games</h1>
        <h2>Balance: ${balance}</h2>
        <Routes>
          <Route path="/minesweeper" element={<Minesweeper balance={balance} setBalance={setBalance} />} />
          <Route path="/roulette" element={<RouletteTable balance={balance} setBalance={setBalance} />} />
          <Route path="/slots" element={<SlotMachine balance={balance} setBalance={setBalance} />} />
          <Route path="/poker" element={<PokerGame balance={balance} setBalance={setBalance} />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="container">
      <div className="card"><Link to="/minesweeper">Minesweeper</Link></div>
      <div className="card"><Link to="/roulette">Roulette Table</Link></div>
      <div className="card"><Link to="/slots">Slot Machine</Link></div>
      <div className="card"><Link to="/poker">Poker Game</Link></div>
    </div>
  );
}

export default App;
