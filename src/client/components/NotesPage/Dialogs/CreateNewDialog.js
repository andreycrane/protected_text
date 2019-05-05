// @flow

import React, { useCallback } from 'react';
import type { Node } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export type TProps = $ReadOnly<{
  state: mixed,
  send: (args: mixed) => void,
}>;

export default function CreateNewDialog(props: TProps): Node {
  const { state, send } = props;

  const onCreateSite = useCallback((): void => send('CREATE_EMPTY'));
  function onCancel() {
    send('CANCEL');
  }

  return (
    <Dialog open={state.matches('FREE')}>
      <DialogTitle>Create new site?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {'Great! This site doesn\'t exist, it can be yours! Would you like to create:'}
        </DialogContentText>
        <Typography
          align="center"
          variant="h6"
        >
          {state.context.id}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onCreateSite}
        >
          Create site
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
