// @flow

import React from 'react';
import type { Node } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddCircle from '@material-ui/icons/AddCircle';

import TabLabel from './TabLabel';

export type TProps = $ReadOnly<{
  notes: TNotes,
  currentNoteId: string,
  onAddNote: () => boolean,
  onRemoveNote: (id: string) => void,
  onChangeCurrent: (newId: string) => void,
  classes: TStyles,
}>;

export default function DesktopLine(props: TProps): Node {
  const {
    notes,
    currentNoteId,
    onRemoveNote,
    onAddNote,
    onChangeCurrent,
    classes,
  } = props;

  return (
    <Tabs
      onChange={onChangeCurrent}
      value={currentNoteId}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
      className={classes.tabLine}
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
        onClick={onAddNote}
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
                <AddCircle />
              </IconButton>
            </Grid>
          </Grid>
        )}
      />
    </Tabs>
  );
}
