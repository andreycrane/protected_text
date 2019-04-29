// @flow

import React from 'react';
import type { Node } from 'react';

import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

import NotesArea from './NotesArea';
import TopBar from './TopBar';
import {
  PasswordRequiredDialog,
  CreateNewDialog,
  ChangePasswordDialog,
  CreatePasswordDialog,
} from './Dialogs';

import { useMachine } from '../machine';

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
  machine: mixed,
}>;

export function AppComponent(props: TProps): Node {
  const { classes, machine } = props;
  const [state, send] = useMachine(machine);

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
          <TopBar
            state={state}
            send={send}
          />
        </Grid>
        <Grid
          item
          xs={12}
          className={classes.tabs}
        >
          <NotesArea
            state={state}
            send={send}
          />
        </Grid>
      </Grid>
      <CreateNewDialog
        state={state}
        send={send}
      />
      <PasswordRequiredDialog />
      <ChangePasswordDialog />
      <CreatePasswordDialog
        state={state}
        send={send}
      />
    </CssBaseline>
  );
}

export default withStyles(styles)(AppComponent);
