import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// The main Minesweeper game component, handling game state and API calls.
function Minesweeper({ balance, setBalance }) {
  const [clicks, setClicks] = useState(0);
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(true);

  // Starts a new game by making a POST request to the backend with the current balance.
  const startNewGame = async () => {
    if (balance >= 5) {
      try {
        // POST request to start a new game, sending the current balance to the backend.
        const response = await axios.post('http://localhost:5000/minesweeper/start', { balance });
        const { grid: newGrid, newBalance, clicks: newClicks } = response.data;
        setBalance(newBalance);
        setClicks(newClicks);
        setGameOver(false);
        setGrid(newGrid);
      } catch (error) {
        console.error('Error starting new game:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Insufficient balance');
    }
  };

  // Handles a cell click by making a POST request to the backend with the current game state and click index.
  const handleClick = async (index) => {
    if (!gameOver && clicks > 0 && !grid[index].clicked) {
      try {
        // POST request to handle a cell click, sending the current balance, grid, clicks, and click index to the backend.
        const response = await axios.post('http://localhost:5000/minesweeper/click', {
          balance,
          grid,
          clicks,
          index
        });
        const { grid: newGrid, newBalance, clicks: newClicks, gameOver: newGameOver } = response.data;
        setGrid(newGrid);
        setBalance(newBalance);
        setClicks(newClicks);
        setGameOver(newGameOver);

        if (newGrid[index].value === 'bomb') {
          alert('You hit a bomb! Game over.');
        } else if (newGameOver) {
          alert('Game over! No more clicks remaining.');
        }
      } catch (error) {
        console.error('Error clicking cell:', error);
        alert('An error occurred. Please try again.');
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