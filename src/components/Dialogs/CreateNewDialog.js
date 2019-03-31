// @flow

import React from 'react';
import type { Node } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

export default function CreateNewDialog(): Node {
  return (
    <Dialog open={false}>
      <DialogTitle>Create new site?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {'Great! This site doesn\'t exist, it can be yours! Would you like to create:'}
        </DialogContentText>
        <DialogContentText
          align="center"
          variant="h4"
        >
          {'test'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary">
          Create site
        </Button>
        <Button>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
