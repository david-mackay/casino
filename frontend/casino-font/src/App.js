// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Minesweeper from './Minesweeper';
import RouletteTable from './RouletteTable';
import SlotMachine from './SlotMachine';
import PokerGame from './PokerGame';
import Web3SignIn from './Web3SignIn';
import './App.css';

function App() {
  const [balance, setBalance] = useState(500);
  const [address, setAddress] = useState(null);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Web3SignIn setAddress={setAddress} />} />
          <Route path="/casino" element={<Casino balance={balance} setBalance={setBalance} />} />
        </Routes>
      </div>
    </Router>
  );
}

function Casino({ balance, setBalance }) {
  return (
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
  );
}

function Home() {
  return (
    <div className="container">
      <div className="card"><Link to="/casino/minesweeper">Minesweeper</Link></div>
      <div className="card"><Link to="/casino/roulette">Roulette Table</Link></div>
      <div className="card"><Link to="/casino/slots">Slot Machine</Link></div>
      <div className="card"><Link to="/casino/poker">Poker Game</Link></div>
    </div>
  );
}

export default App;
