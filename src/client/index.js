// @flow

import React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import machine, { initContext } from './machine';

import './styles/index.css';

const rootDiv = document.createElement('div');

if (document.body && rootDiv) {
  rootDiv.className = 'root';
  document.body.appendChild(rootDiv);

  render(
    (
      <App machine={machine.withContext(initContext(null, 'new_site'))} />
    ),
    rootDiv,
  );
}
