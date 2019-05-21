// @flow

import React, { useCallback } from 'react';
import type { Node } from 'react';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';

import MobileLine from './MobileLine';
import DesktopLine from './DesktopLine';

const styles = (): TStyles => ({
  tabLine: {
    order: '0',
    flex: '0 1 auto',
    alignSelf: 'auto',
  },
  fabAddNote: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
  },
});

export type TProps = $ReadOnly<{
  notes: TNotes,
  currentNoteId: string,
  onNewNote: () => void,
  onRemoveNote: (id: string) => void,
  onChangeCurrent: (newId: string) => void,
  classes: TStyles,
}>;

export function TabsLineComponent(props: TProps): Node {
  const {
    notes,
    currentNoteId,
    onNewNote,
    onChangeCurrent,
    onRemoveNote,
    classes,
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
    <React.Fragment>
      <Hidden mdDown>
        <DesktopLine
          notes={notes}
          currentNoteId={currentNoteId}
          onRemoveNote={onRemoveNote}
          classes={classes}
          onAddNote={handleAdd}
          onChangeCurrent={handleChangeCurrent}
        />
      </Hidden>
      <Hidden mdUp>
        <MobileLine
          notes={notes}
          currentNoteId={currentNoteId}
          onRemoveNote={onRemoveNote}
          classes={classes}
          onAddNote={handleAdd}
          onChangeCurrent={handleChangeCurrent}
        />
      </Hidden>
    </React.Fragment>
  );
}

export default withStyles(styles)(TabsLineComponent);
