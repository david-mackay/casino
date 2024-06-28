import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// The main RouletteTable component, handling game state and API calls.
function RouletteTable({ balance, setBalance }) {
  const [bets, setBets] = useState({});
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState(null);
  const [winningColor, setWinningColor] = useState(null);
  const [winAmount, setWinAmount] = useState(0);
  const [numbers] = useState([
    { number: 0, color: 'green' },
    { number: 32, color: 'red' }, { number: 15, color: 'black' }, { number: 4, color: 'red' },
    { number: 21, color: 'red' }, { number: 2, color: 'black' }, { number: 25, color: 'black' },
    { number: 17, color: 'black' }, { number: 34, color: 'red' }, { number: 6, color: 'black' },
    { number: 27, color: 'red' }, { number: 13, color: 'black' }, { number: 36, color: 'red' },
    { number: 11, color: 'black' }, { number: 30, color: 'red' }, { number: 8, color: 'black' },
    { number: 23, color: 'red' }, { number: 10, color: 'black' }, { number: 5, color: 'red' },
    { number: 24, color: 'black' }, { number: 16, color: 'red' }, { number: 33, color: 'black' },
    { number: 1, color: 'red' }, { number: 20, color: 'black' }, { number: 14, color: 'red' },
    { number: 31, color: 'black' }, { number: 9, color: 'red' }, { number: 22, color: 'black' },
    { number: 18, color: 'red' }, { number: 29, color: 'black' }, { number: 7, color: 'red' },
    { number: 28, color: 'black' }, { number: 12, color: 'red' }, { number: 35, color: 'black' },
    { number: 3, color: 'red' }, { number: 26, color: 'black' }, { number: 19, color: 'red' }
  ]);

  // Simulates the roulette wheel spinning by rapidly changing the selected number.
  useEffect(() => {
    if (isSpinning) {
      let counter = 0;
      const interval = setInterval(() => {
        setSelectedNumber(numbers[Math.floor(Math.random() * numbers.length)].number);
        counter++;
        if (counter >= 20) {
          clearInterval(interval);
          setIsSpinning(false);
          handleSpin();
        }
      }, 250);
    }
  }, [isSpinning, numbers]);

  // Places a bet by deducting the bet amount from the balance and updating the bets state.
  const handleBet = (type, amount) => {
    if (balance >= amount) {
      setBets(prevBets => ({ ...prevBets, [type]: (prevBets[type] || 0) + amount }));
      setBalance(prevBalance => prevBalance - amount);
    }
  };

  // Handles the spin by making a POST request to the backend with the current bets and balance.
  const handleSpin = async () => {
    try {
      // POST request to handle the spin, sending the current bets and balance to the backend.
      const response = await axios.post('http://localhost:5000/spin', {
        bets,
        balance
      });
      const { winningNumber, winningColor, newBalance, winAmount } = response.data;
      setWinningNumber(winningNumber);
      setWinningColor(winningColor);
      setBalance(newBalance);
      setWinAmount(winAmount);
      setBets({});
    } catch (error) {
      console.error('Error spinning the wheel:', error);
    }
  };

  // Starts the wheel spinning.
  const startSpin = () => {
    setIsSpinning(true);
  };

  // Calculates the total bet amount for a given number.
  const getBetAmount = (number) => {
    let amount = 0;
    if (bets['even'] && number % 2 === 0) {
      amount += bets['even'];
    }
    if (bets['odd'] && number % 2 !== 0) {
      amount += bets['odd'];
    }
    if (bets['red'] && numbers.find(n => n.number === number).color === 'red') {
      amount += bets['red'];
    }
    if (bets['black'] && numbers.find(n => n.number === number).color === 'black') {
      amount += bets['black'];
    }
    if (bets[number.toString()]) {
      amount += bets[number.toString()];
    }
    return amount;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Link to="/">Home</Link>
      <h1>Roulette Table</h1>
      <p>Balance: ${balance}</p>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
        <button onClick={() => handleBet('even', 10)}>Bet Even $10</button>
        <button onClick={() => handleBet('odd', 10)}>Bet Odd $10</button>
        <button onClick={() => handleBet('red', 10)}>Bet Red $10</button>
        <button onClick={() => handleBet('black', 10)}>Bet Black $10</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {numbers.map((n, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: 12, color: 'green' }}>+${getBetAmount(n.number)}</p>
            <button style={{ backgroundColor: n.color, color: 'white', width: 50, height: 50, margin: 5 }} onClick={() => handleBet(n.number.toString(), 10)}>{n.number}</button>
          </div>
        ))}
      </div>
      <button onClick={startSpin}>Spin</button>
      {isSpinning && (
        <div style={{ fontSize: 48, fontWeight: 'bold', marginTop: 20 }}>{selectedNumber}</div>
      )}
      {winningNumber !== null && (
        <div>
          <div style={{ fontSize: 48, fontWeight: 'bold', marginTop: 20 }}>Winning Number: {winningNumber}</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: winningColor }}>{winningColor.toUpperCase()}</div>
          {winAmount > 0 ? (
            <div style={{ fontSize: 24, color: 'green' }}>You won ${winAmount}!</div>
          ) : (
            <div style={{ fontSize: 24, color: 'red' }}>Oh no, you lost.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default RouletteTable;