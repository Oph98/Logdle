import React, { useEffect } from 'react';
import Game from './Game';
import './App.css';

function App() {
  useEffect(() => {
    document.body.style.backgroundColor = '#1e1e1e'; // Dark mode
    document.body.style.color = '#ffffff'; // Light text
  }, []);

  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
