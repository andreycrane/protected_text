// @flow

import React, { useCallback, useState } from 'react';
import type { Node } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export type TProps = $ReadOnly<{
  open: boolean,
  title: string,
  text: string,
  onSave: (password: string) => void,
  onCancel: () => void,
}>;

export default function BasePasswordDialog(props: TProps): Node {
  const {
    title,
    text,
    open,
    onSave,
    onCancel,
  } = props;

  const [state, setState] = useState({
    password: '',
    repeatedPassword: '',
  });

  const onPasswordChange = useCallback(
    (e) => {
      const { value } = e.target;
      setState(prev => ({ ...prev, password: value }));
    },
    [setState],
  );

  const onRepeatedPasswordChange = useCallback(
    (e) => {
      const { value } = e.target;

      setState(prev => ({ ...prev, repeatedPassword: value }));
    },
    [setState],
  );

  function onSaveClick() {
    console.log('here', state);
  }

  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
          value={state.password}
          onChange={onPasswordChange}
        />
        <TextField
          margin="dense"
          id="repat_password"
          label="Repeat password"
          type="password"
          fullWidth
          value={state.repeatedPassword}
          onChange={onRepeatedPasswordChange}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onSaveClick}
        >
          Save
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
