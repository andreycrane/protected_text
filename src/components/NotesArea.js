// @flow

import React from 'react';
import type { Node } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import AccessAlarmIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';

import TabLabel from './TabLabel';
import Editor from './Editor';

export type TProps = $ReadOnly<{
  notes: TNotes,
  currentNote: TNote,
  onNewNote: () => void,
  onRemoveNote: (id: string) => void,
  onUpdateNote: (note: TNote) => void,
  onChangeCurrent: (newId: string) => void,
}>;

export default function NotesArea(props: TProps): Node {
  const {
    notes,
    currentNote,
    onNewNote,
    onUpdateNote,
    onRemoveNote,
    onChangeCurrent,
  } = props;

  function handleAdd(event): boolean {
    event.stopPropagation();
    event.preventDefault();

    onNewNote();

    return false;
  }

  function handleChangeCurrent(event, value) {
    onChangeCurrent(value);
  }

  return (
    <React.Fragment>
      <Tabs
        onChange={handleChangeCurrent}
        value={currentNote.id}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {notes.map(({ id, label }): Node => (
          <Tab
            component="div"
            key={id}
            value={id}
            label={(
              <TabLabel
                id={id}
                label={label}
                onRemove={onRemoveNote}
              />
            )}
          />
        ))}
        <Tab
          component="div"
          key="add_tab"
          value="add_tab"
          onClick={handleAdd}
          label={(
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item xs={3}>
                <IconButton
                  color="primary"
                >
                  <AccessAlarmIcon />
                </IconButton>
              </Grid>
            </Grid>
          )}
        />
      </Tabs>
      <Editor
        note={currentNote}
        onChange={onUpdateNote}
      />
    </React.Fragment>
  );
}
