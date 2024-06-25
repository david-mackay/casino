// src/Minesweeper.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Minesweeper({ balance, setBalance }) {
  const [clicks, setClicks] = useState(0);
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(true);

  useEffect(() => {
    if (clicks === 0 && !gameOver) {
      setGameOver(true);
    }
  }, [clicks, gameOver]);

  const startNewGame = () => {
    if (balance >= 5) {
      setBalance(balance - 5);
      setClicks(3);
      setGameOver(false);
      const newGrid = [];
      for (let i = 0; i < 9; i++) {
        newGrid.push({ clicked: false, value: '' });
      }
      const bombIndexes = [];
      while (bombIndexes.length < 2) {
        const randomIndex = Math.floor(Math.random() * 9);
        if (!bombIndexes.includes(randomIndex)) {
          bombIndexes.push(randomIndex);
          newGrid[randomIndex].value = 'bomb';
        }
      }
      const moneyIndexes = [];
      while (moneyIndexes.length < 5) {
        const randomIndex = Math.floor(Math.random() * 9);
        if (!bombIndexes.includes(randomIndex) && !moneyIndexes.includes(randomIndex)) {
          moneyIndexes.push(randomIndex);
          newGrid[randomIndex].value = 'money';
        }
      }
      setGrid(newGrid);
    }
  };

  const handleClick = (index) => {
    if (!gameOver && clicks > 0 && !grid[index].clicked) {
      const newGrid = [...grid];
      newGrid[index].clicked = true;
      setGrid(newGrid);
      setClicks(clicks - 1);
      if (grid[index].value === 'money') {
        setBalance(balance + 10);
      } else if (grid[index].value === 'bomb') {
        setBalance(balance - 20);
        setGameOver(true);
      }
    }
  };

  return (
    <div>
      <Link to="/">Home</Link>
      <h1>Minesweeper</h1>
      <h2>Balance: ${balance}</h2>
      <h2>Clicks remaining: {clicks}</h2>
      <button onClick={startNewGame} disabled={!gameOver}>
        Start New Game ($5)
      </button>
      {grid.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '300px' }}>
          {grid.map((cell, index) => (
            <div
              key={index}
              style={{
                width: '100px',
                height: '100px',
                border: '1px solid black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '24px',
              }}
              onClick={() => handleClick(index)}
            >
              {cell.clicked ? (
                cell.value === 'money' ? (
                  <p>💸</p>
                ) : cell.value === 'bomb' ? (
                  <p>💣</p>
                ) : (
                  <p></p>
                )
              ) : (
                <p>?</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Minesweeper;
