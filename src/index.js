import React from 'react';
import { render } from 'react-dom';

import App from './App';
import './styles.css';

const rootDiv = document.createElement('div');

if (document.body && rootDiv) {
  rootDiv.className = 'root';
  document.body.appendChild(rootDiv);

  render(
    (
      <App />
    ),
    rootDiv,
  );
}
