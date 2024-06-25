// src/SlotMachine.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  const winPercentage = 0.05; // 5% chance of winning
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

  const spin = () => {
    if (balance < 1) {
      alert('Insufficient balance');
      return;
    }

    setIsSpinning(true);
    setBalance(balance - 1);

    setTimeout(() => {
      setIsSpinning(false);
      const hasWon = Math.random() < winPercentage;
      if (hasWon) {
        const winningEmoji = getRandomEmoji();
        setSlot1(winningEmoji);
        setSlot2(winningEmoji);
        setSlot3(winningEmoji);
        setBalance(balance => balance + 1000);
      } else {
        setSlot1(getRandomEmoji());
        setSlot2(getRandomEmoji());
        while (true) {
          const slot3Emoji = getRandomEmoji();
          if (slot3Emoji !== slot1 && slot3Emoji !== slot2) {
            setSlot3(slot3Emoji);
            break;
          }
        }
      }
      setTopSlot1(getRandomEmoji());
      setTopSlot2(getRandomEmoji());
      setTopSlot3(getRandomEmoji());
      setBottomSlot1(getRandomEmoji());
      setBottomSlot2(getRandomEmoji());
      setBottomSlot3(getRandomEmoji());
    }, 2000);
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
