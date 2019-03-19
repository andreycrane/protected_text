import React from 'react';
import { render } from 'react-dom';

const rootDiv = document.createElement('div');

if (document.body && rootDiv) {
  document.body.appendChild(rootDiv);
  render(
    (
      <h1>Hello world</h1>
    ),
    rootDiv,
  );
}
