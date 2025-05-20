
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import initializeApp from './services/initializeApp';

// Initialize the app with proper environment settings
initializeApp().catch(error => {
  console.error('Failed to initialize the application:', error);
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
