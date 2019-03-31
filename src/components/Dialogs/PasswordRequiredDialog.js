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

export default function PasswordRequiredDialog(): Node {
  return (
    <Dialog open={false}>
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
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary">
          Decrypt
        </Button>
        <Button>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
