// @flow

import React, { useState } from 'react';
import type { Node } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';

import { isValidUrl } from '../../lib';

const styles = (): TStyles => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',

    width: '100vw',
    height: '100vh',
  },
  main: {
    flexGrow: '1',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  paper: {
    minWidth: '400px',
    margin: '120px auto',
    padding: '10px 15px',
  },
  urlInput: {
    marginBottom: '15px',
  },
});

export type TProps = $ReadOnly<{
  classes: TStyles,
  history: RouterHistory,
}>;


export type TState = $ReadOnly<{
  siteName: string,
  error: boolean,
}>;

const defaultState: TState = {
  siteName: '',
  error: false,
  helperText: '',
};

export function MainPageComponent(props: TProps): Node {
  const { classes, history } = props;

  const [state, setState] = useState<TState>(defaultState);

  function onChangeName(e) {
    const { value } = e.target;

    setState(
      (prevState: TState): TState => ({
        ...prevState,
        siteName: value,
        error: false,
      }),
    );
  }

  function onSubmit(e) {
    e.preventDefault();

    const { siteName } = state;

    if (isValidUrl(siteName) !== true) {
      setState(
        (prevState: TState): TState => ({
          ...prevState,
          error: true,
        }),
      );
      return;
    }

    history.push(`/${siteName}`);
  }

  return (
    <div className={classes.container}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Protected Text
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.main}>
        <Paper
          square
          className={classes.paper}
        >
          <Typography variant="h6">
            {`Go to protectedText.com/${state.siteName}`}
          </Typography>
          <form
            noValidate
            autoComplete="off"
            onSubmit={onSubmit}
          >
            <TextField
              error={state.error}
              id="site-name"
              label="Site name"
              fullWidth
              margin="normal"
              onChange={onChangeName}
              value={state.siteName}
              helperText="url must be a string of A-Za-z0-9_-"
              className={classes.urlInput}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              color="primary"
            >
              Go
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
}

export default withRouter(withStyles(styles)(MainPageComponent));
