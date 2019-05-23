// @flow

import React from 'react';
import type { Node } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import withMobileDialog from '@material-ui/core/withMobileDialog';

export type TProps = $ReadOnly<{
  fullScreen: boolean,
  state: mixed,
  send: (args: mixed) => void,
}>;

export function SavingErrorDialog(props: TProps): Node {
  const { state, send, fullScreen } = props;

  function onRepeat() {
    send('REPEAT');
  }

  function onCancel() {
    send('CANCEL');
  }

  return (
    <Dialog
      open={state.matches({ SAVING: 'error' })}
      disableBackdropClick
      disableEscapeKeyDown
      fullScreen={fullScreen}
    >
      <DialogTitle>Error while saving your notes</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {'Something went wrong when we tried to save your notes. To try it again push the "Repeat" button'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onRepeat}
        >
          Repeat
        </Button>
        <Button
          onClick={onCancel}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withMobileDialog()(SavingErrorDialog);
