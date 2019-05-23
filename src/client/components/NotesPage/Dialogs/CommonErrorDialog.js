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
  matches: $ReadOnlyArray<string>,
}>;

export function CommonErrorDialog(props: TProps): Node {
  const {
    state,
    send,
    fullScreen,
    matches,
  } = props;

  function onRepeat() {
    send('REPEAT');
  }

  function onCancel() {
    send('CANCEL');
  }


  function isOpen(): boolean {
    return matches.some(s => state.matches(s));
  }

  function getErrorMessage(): string {
    if (isOpen() === false) {
      return '';
    }

    const pathes = state.toStrings();
    const fullStatePath = `machine.${pathes[pathes.length - 1]}`;

    return state.meta[fullStatePath].message;
  }

  return (
    <Dialog
      open={isOpen()}
      disableBackdropClick
      disableEscapeKeyDown
      fullScreen={fullScreen}
    >
      <DialogTitle>Something went wrong</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {getErrorMessage()}
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

export default withMobileDialog()(CommonErrorDialog);
