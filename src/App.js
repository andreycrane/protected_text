// @flow

import React from 'react';
import type { Node } from 'react';

import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

import NotesArea from './NotesArea';

export type TStyles = $ReadOnly<{
  [string]: string | TStyles,
}>;

const styles = (): TStyles => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
  },
  appbar: {
    flex: '0 1 auto',
    alignSelf: 'stretch',
  },
  tabs: {
    flexGrow: '1 1 auto',
    alignSelf: 'stretch',
  },
});

export type TProps = $ReadOnly<{
  classes: TStyles,
}>;

export function AppComponent({ classes }: TProps): Node {
  return (
    <CssBaseline>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        className={classes.container}
      >
        <Grid
          item
          xs={12}
          className={classes.appbar}
        >
          <AppBar position="relative">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                Protected Text
              </Typography>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid
          item
          xs={12}
          className={classes.tabs}
        >
          <NotesArea />
        </Grid>
      </Grid>
    </CssBaseline>
  );
}

export default withStyles(styles)(AppComponent);
