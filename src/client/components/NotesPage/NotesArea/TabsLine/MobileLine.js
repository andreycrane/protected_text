// @flow

import React from 'react';
import type { Node } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TabLabel from './TabLabel';

export type TProps = $ReadOnly<{
  notes: TNotes,
  currentNoteId: string,
  onAddNote: () => boolean,
  onRemoveNote: (id: string) => void,
  onChangeCurrent: (newId: string) => void,
  classes: TStyles,
}>;

export default function MobileLine(props: TProps): Node {
  const {
    notes,
    currentNoteId,
    onRemoveNote,
    onAddNote,
    onChangeCurrent,
    classes,
  } = props;

  return (
    <React.Fragment>
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
      </Tabs>
      <Fab
        color="primary"
        className={classes.fabAddNote}
        onClick={onAddNote}
      >
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
}
