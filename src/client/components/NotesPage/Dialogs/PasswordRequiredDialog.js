// @flow

import React, { useState, useCallback } from 'react';
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

export default function PasswordRequiredDialog(props: TProps): Node {
  const { state, send } = props;

  const [password, setPassword] = useState('');
  const onChangePassword = useCallback(
    (e) => {
      const { value } = e.target;
      setPassword(value);
    },
    [setPassword],
  );

  function onDecrypt() {
    send({ type: 'DECRYPT', password });
  }

  function onCancel() {
    send('CANCEL');
  }

  return (
    <Dialog open={state.matches('ENCRYPTED')}>
      <DialogTitle>Password required</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Somebody already occupied this site, you can try different URL.
          If this is your site enter the password.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="password"
          label="Password used to encrypt this site"
          type="password"
          fullWidth
          value={password}
          onChange={onChangePassword}
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
