// @flow

import React, { useReducer, useCallback } from 'react';
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
import reducer, { initState } from './duck';

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
  initialNotes: TNotes,
}>;

export function AppComponent(props: TProps): Node {
  const { classes, initialNotes } = props;
  const [state, dispatch] = useReducer(reducer, initialNotes, initState);

  const currentNote = state.notes.find((n: TNote): boolean => n.id === state.currentId);

  const onNewNote = useCallback((): void => dispatch({ type: 'NEW_NOTE' }));
  const onRemoveNote = useCallback((id: string): void => dispatch({ type: 'REMOVE_NOTE', id }));
  const onChangeCurrent = useCallback((newId: string): void => dispatch({ type: 'CHANGE_CURRENT', newId }));
  const onUpdateNote = useCallback((note: TNote): void => dispatch({ type: 'UPDATE_NOTE', note }));

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
          <TopBar />
        </Grid>
        <Grid
          item
          xs={12}
          className={classes.tabs}
        >
          {currentNote && (
            <NotesArea
              notes={state.notes}
              currentNote={currentNote}
              onNewNote={onNewNote}
              onUpdateNote={onUpdateNote}
              onRemoveNote={onRemoveNote}
              onChangeCurrent={onChangeCurrent}
            />
          )}
        </Grid>
      </Grid>
      <PasswordRequiredDialog />
      <CreateNewDialog />
      <ChangePasswordDialog />
      <CreatePasswordDialog />
    </CssBaseline>
  );
}

export default withStyles(styles)(AppComponent);
