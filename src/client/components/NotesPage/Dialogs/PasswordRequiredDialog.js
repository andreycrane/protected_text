// @flow

import React, { useState, useCallback, useEffect } from 'react';
import type { Node } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export type TProps = $ReadOnly<{
  state: mixed,
  send: (args: mixed) => void,
}>;

export type TState = $ReadOnly<{
  password: string,
  error: boolean,
  helperText: string,
}>;

export default function PasswordRequiredDialog(props: TProps): Node {
  const { state, send } = props;
  const [localState, setLocalState] = useState<TState>({
    password: '',
    error: false,
    helperText: '',
  });

  useEffect(
    (): void => setLocalState(
      (prevState: TState): TState => ({
        ...prevState,
        error: state.matches({ ENCRYPTED: 'error' }),
        helperText: state.matches({ ENCRYPTED: 'error' }) ? 'Password is wrong' : '',
      }),
    ),
    [state],
  );

  const onChangePassword = useCallback(
    (e) => {
      const { value } = e.target;
      setLocalState({
        password: value,
        error: false,
        helperText: '',
      });
    },
    [setLocalState],
  );

  function onDecrypt() {
    send({ type: 'DECRYPT', password: localState.password });
  }

  function onCancel() {
    send('CANCEL');
  }

  return (
    <Dialog
      open={state.matches('ENCRYPTED')}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle>Password required</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Somebody already occupied this site, you can try different URL.
          If this is your site enter the password.
        </DialogContentText>
        <TextField
          error={localState.error}
          autoFocus
          margin="dense"
          id="password"
          label="Password used to encrypt this site"
          type="password"
          fullWidth
          value={localState.password}
          onChange={onChangePassword}
          helperText={localState.helperText}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onDecrypt}
        >
          Decrypt
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
