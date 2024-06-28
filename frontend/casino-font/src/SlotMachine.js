import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SlotMachine({ balance, setBalance }) {
  const [slot1, setSlot1] = useState('');
  const [slot2, setSlot2] = useState('');
  const [slot3, setSlot3] = useState('');
  const [topSlot1, setTopSlot1] = useState('');
  const [topSlot2, setTopSlot2] = useState('');
  const [topSlot3, setTopSlot3] = useState('');
  const [bottomSlot1, setBottomSlot1] = useState('');
  const [bottomSlot2, setBottomSlot2] = useState('');
  const [bottomSlot3, setBottomSlot3] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const emojis = ['🍉', '🍊', '🍇', '🍎', '🥝', '🍓', '🥭', '🍑', '🍒', '🍈'];

  useEffect(() => {
    if (isSpinning) {
      const intervalId = setInterval(() => {
        setTopSlot1(getRandomEmoji());
        setTopSlot2(getRandomEmoji());
        setTopSlot3(getRandomEmoji());
        setSlot1(getRandomEmoji());
        setSlot2(getRandomEmoji());
        setSlot3(getRandomEmoji());
        setBottomSlot1(getRandomEmoji());
        setBottomSlot2(getRandomEmoji());
        setBottomSlot3(getRandomEmoji());
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [isSpinning]);

  const getRandomEmoji = () => {
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const spin = async () => {
    if (balance < 1) {
      alert('Insufficient balance');
      return;
    }

    setIsSpinning(true);
    setBalance(balance - 1);

    try {
      const response = await axios.post('http://localhost:5000/slot', { balance });
      const result = response.data;

      setTimeout(() => {
        setIsSpinning(false);
        setSlot1(result.slot1);
        setSlot2(result.slot2);
        setSlot3(result.slot3);
        setTopSlot1(result.topSlot1);
        setTopSlot2(result.topSlot2);
        setTopSlot3(result.topSlot3);
        setBottomSlot1(result.bottomSlot1);
        setBottomSlot2(result.bottomSlot2);
        setBottomSlot3(result.bottomSlot3);
        setBalance(result.newBalance);

        if (result.hasWon) {
          alert('Congratulations! You won $1000!');
        }
      }, 2000);
    } catch (error) {
      console.error('Error spinning the slot machine:', error);
      setIsSpinning(false);
      setBalance(balance + 1);  // Refund the spin cost
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <Link to="/">Home</Link>
      <h1>Slot Machine</h1>
      <p>Balance: ${balance}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: '64px' }}>{topSlot1}</span>
          <span style={{ fontSize: '64px' }}>{topSlot2}</span>
          <span style={{ fontSize: '64px' }}>{topSlot3}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: '64px' }}>{slot1}</span>
          <span style={{ fontSize: '64px' }}>{slot2}</span>
          <span style={{ fontSize: '64px' }}>{slot3}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '64px' }}>{bottomSlot1}</span>
          <span style={{ fontSize: '64px' }}>{bottomSlot2}</span>
          <span style={{ fontSize: '64px' }}>{bottomSlot3}</span>
        </div>
      </div>
      <button onClick={spin} disabled={isSpinning || balance < 1}>
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
}

export default SlotMachine;