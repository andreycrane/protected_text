// @flow

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import NotesPage from './components/NotesPage';
import MainPage from './components/MainPage';

import machine, { initContext } from './machine';

import './styles/index.css';

const rootDiv = document.createElement('div');

if (document.body && rootDiv) {
  rootDiv.className = 'root';
  document.body.appendChild(rootDiv);

  render(
    (
      <BrowserRouter>
        <Route path="/" exact component={MainPage} />
        <Route
          path="/:name(\S+)"
          render={
            () => (
              <NotesPage
                machine={machine.withContext(initContext(null, 'site_name'))}
              />
            )
          }
        />
      </BrowserRouter>
    ),
    rootDiv,
  );
}
