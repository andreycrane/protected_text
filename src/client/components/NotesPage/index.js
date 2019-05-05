// @flow

import React, { useMemo, useEffect } from 'react';
import type { Node } from 'react';
import type { Match, RouterHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { useMachine } from '@xstate/react';
import machine, { initContext } from '../../machine';

import NotesArea from './NotesArea';
import TopBar from './TopBar';
import {
  PasswordRequiredDialog,
  CreateNewDialog,
  ChangePasswordDialog,
  CreatePasswordDialog,
} from './Dialogs';


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
    flex: '1 1 auto',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignContent: 'stretch',
    alignItems: 'stretch',
  },
});

export type TProps = $ReadOnly<{
  classes: TStyles,
  match: Match,
  history: RouterHistory,
}>;

export function AppComponent(props: TProps): Node {
  const { classes, match, history } = props;
  const { params } = match;

  const appMachine = useMemo(
    () => machine.withContext(initContext(params.name)),
    [params.name],
  );

  const [state, send, service] = useMachine(appMachine);

  useEffect(
    () => {
      service.onDone(() => {
        history.push('/');
      });
    },
    [service],
  );

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
      <PasswordRequiredDialog
        state={state}
        send={send}
      />
      <ChangePasswordDialog
        state={state}
        send={send}
      />
      <CreatePasswordDialog
        state={state}
        send={send}
      />
    </CssBaseline>
  );
}

export default withStyles(styles)(AppComponent);
