// @flow

import React from 'react';
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
}>;

export default function BasePasswordDialog(props: TProps): Node {
  const { title, text, open } = props;

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
        />
        <TextField
          margin="dense"
          id="repat_password"
          label="Repeat password"
          type="password"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary">
          Save
        </Button>
        <Button>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
