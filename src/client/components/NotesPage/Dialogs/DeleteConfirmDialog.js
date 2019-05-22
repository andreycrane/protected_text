// @flow

import React, { useCallback } from 'react';
import type { Node } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import withMobileDialog from '@material-ui/core/withMobileDialog';

export type TProps = $ReadOnly<{
  fullScreen: boolean,
  state: mixed,
  send: (args: mixed) => void,
}>;

export function DeleteConfirmDialog(props: TProps): Node {
  const { state, send, fullScreen } = props;

  const onYes = useCallback(
    (): void => send('OK'),
    [send],
  );

  const onNo = useCallback(
    (): void => send('CANCEL'),
    [send],
  );

  return (
    <Dialog
      open={state.matches({ DELETING: 'confirm' })}
      maxWidth="sm"
      disableBackdropClick
      disableEscapeKeyDown
      fullScreen={fullScreen}
    >
      <DialogTitle>Delete site</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {'Are you sure?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onYes}
        >
          Yes
        </Button>
        <Button
          onClick={onNo}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withMobileDialog()(DeleteConfirmDialog);
