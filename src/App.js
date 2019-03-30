// @flow

import React, { useState } from 'react';
import type { Node } from 'react';

import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { ContentState, convertToRaw } from 'draft-js';

import type { TNotes, TNote } from './types';
import { genId } from './lib';
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
  initialNotes: TNotes,
}>;

export function AppComponent(props: TProps): Node {
  const { classes, initialNotes } = props;
  const [notes, setNotes] = useState(initialNotes);

  function onNewNote() {
    const newLabel = `Note ${notes.length + 1}`;
    const newNote = {
      id: genId(),
      label: `Note ${notes.length + 1}`,
      rawContent: convertToRaw(
        ContentState.createFromText(newLabel),
      ),
    };

    setNotes([
      ...notes,
      newNote,
    ]);
  }

  function onRemoveNote(id: string) {
    setNotes(notes.filter((n): boolean => n.id !== id));
  }

  function onUpdateNote(note: TNote) {
    setNotes(notes.map((n): TNote => {
      if (n.id === note.id) {
        return note;
      }

      return n;
    }));
  }

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
          <NotesArea
            notes={notes}
            onNewNote={onNewNote}
            onUpdateNote={onUpdateNote}
            onRemoveNote={onRemoveNote}
          />
        </Grid>
      </Grid>
    </CssBaseline>
  );
}

export default withStyles(styles)(AppComponent);
