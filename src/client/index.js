// @flow

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import NotesPage from './components/NotesPage';
import MainPage from './components/MainPage';

import './styles/index.css';

const rootDiv = document.createElement('div');

if (document.body && rootDiv) {
  rootDiv.className = 'root';
  document.body.appendChild(rootDiv);

  render(
    (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/:name(\S+)" component={NotesPage} />
        </Switch>
      </BrowserRouter>
    ),
    rootDiv,
  );
}
