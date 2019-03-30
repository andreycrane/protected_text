// @flow

import React from 'react';
import { render } from 'react-dom';
import { ContentState, convertToRaw } from 'draft-js';

import type { TNotes } from './types';
import { genId } from './lib';

import App from './App';
import './styles.css';

const rootDiv = document.createElement('div');

const notes: TNotes = [
  {
    id: genId(),
    label: 'text 1',
    rawContent: convertToRaw(ContentState.createFromText('Test 1')),
  },
  {
    id: genId(),
    label: 'text 2',
    rawContent: convertToRaw(ContentState.createFromText('Test 2')),
  },
  {
    id: genId(),
    label: 'text 3',
    rawContent: convertToRaw(ContentState.createFromText('Test 3')),
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
