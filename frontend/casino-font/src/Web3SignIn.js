// src/Web3SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

function Web3SignIn({ setAddress }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const connectWallet = async () => {
    console.log("Connect called")
    const provider = await detectEthereumProvider();
    console.log(provider)
    if (provider) {
      const web3 = new Web3(provider);
      try {
        // Capture the returned accounts
        const accounts = await provider.request({ method: 'eth_requestAccounts' }); 
        console.log(accounts)
        // Proceed only if an account is received
        if (accounts.length > 0) { 
          const account = accounts[0];
  
          // Sign a message
          const message = 'Sign this message to authenticate';
          const signature = await web3.eth.personal.sign(message, account);
  
          // Send to backend for verification
          console.log("Requesting..."); // This should now print
          const response = await fetch('http://localhost:5000/api/authenticate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address: account, signature, message }),
          });
  
          if (response.ok) {
            const data = await response.json();
            setAddress(account);
            navigate('/casino');
          } else {
            setError('Authentication failed');
          }
        } else {
          setError('No accounts found in MetaMask');
        }
      } catch (err) {
        setError('Failed to connect wallet');
      }
    } else {
      setError('MetaMask is not installed');
    }
  };

  return (
    <div>
      <h2>Sign in with MetaMask</h2>
      <button onClick={connectWallet}>Connect MetaMask</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Web3SignIn;
