import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.js';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App with StrictMode
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
