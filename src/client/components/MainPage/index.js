// @flow

import React from 'react';
import type { Node } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

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
});

export type TProps = $ReadOnly<{
  classes: TStyles,
}>;


export function MainPageComponent(props: TProps): Node {
  const { classes } = props;

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
            {'Go to protectedText.com/'}
          </Typography>
          <form noValidate autoComplete="off">
            <TextField
              id="site-name"
              label="Site name"
              margin="normal"
              fullWidth
            />
            <Button
              type="button"
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

export default withStyles(styles)(MainPageComponent);
