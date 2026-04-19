import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app">
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <ChatInterface />
    </div>
  );
}

export default App;
