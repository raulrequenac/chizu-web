import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import { LocationsContextProvider } from './contexts/LocationsContext'

ReactDOM.render(
  <Router>
    <AuthContextProvider>
      <LocationsContextProvider>
        <App />
      </LocationsContextProvider>
    </AuthContextProvider>
  </Router>,
  document.getElementById('root')
);
