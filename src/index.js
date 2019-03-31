// @flow

import React from 'react';
import { render } from 'react-dom';
import { ContentState, convertToRaw } from 'draft-js';

import { genId } from './lib';

import App from './components/App';
import './styles/index.css';

const rootDiv = document.createElement('div');

const notes: TNotes = [
  {
    id: genId(),
    label: 'Note 1',
    rawContent: convertToRaw(ContentState.createFromText('Note 1')),
  },
  {
    id: genId(),
    label: 'Note 2',
    rawContent: convertToRaw(ContentState.createFromText('Note 2')),
  },
  {
    id: genId(),
    label: 'Note 3',
    rawContent: convertToRaw(ContentState.createFromText('Note 3')),
  },
];

if (document.body && rootDiv) {
  rootDiv.className = 'root';
  document.body.appendChild(rootDiv);

  render(
    (
      <App
        initialNotes={notes}
      />
    ),
    rootDiv,
  );
}
