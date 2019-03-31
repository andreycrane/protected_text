// @flow

import React, { useCallback } from 'react';
import type { Node } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import AccessAlarmIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import TabLabel from './TabLabel';

export type TProps = $ReadOnly<{
  notes: TNotes,
  currentNoteId: string,
  onNewNote: () => void,
  onRemoveNote: (id: string) => void,
  onChangeCurrent: (newId: string) => void,
}>;

export function TabsLineComponent(props: TProps): Node {
  const {
    notes,
    currentNoteId,
    onNewNote,
    onChangeCurrent,
    onRemoveNote,
  } = props;

  const handleChangeCurrent = useCallback(
    (event, value): void => onChangeCurrent(value),
    [onChangeCurrent],
  );

  const handleAdd = useCallback(
    (event): boolean => {
      event.stopPropagation();
      event.preventDefault();

      onNewNote();

      return false;
    },
    [onNewNote],
  );

  return (
    <Tabs
      onChange={handleChangeCurrent}
      value={currentNoteId}
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
  );
}

export default React.memo<TProps>(TabsLineComponent);
