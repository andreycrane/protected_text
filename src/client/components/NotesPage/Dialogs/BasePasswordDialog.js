// @flow

import React, { useCallback, useState, useEffect } from 'react';
import type { Node } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';


export type TProps = $ReadOnly<{
  fullScreen: boolean,
  open: boolean,
  title: string,
  text: string,
  error: boolean,
  onSave: (password: string) => void,
  onCancel: () => void,
}>;


export type TState = $ReadOnly<{
  password: string,
  repeatedPassword: string,
  error: boolean,
}>;

export function BasePasswordDialog(props: TProps): Node {
  const {
    title,
    text,
    open,
    onSave,
    onCancel,
    error,
    fullScreen,
  } = props;

  const [state, setState] = useState<TState>({
    password: '',
    repeatedPassword: '',
    error,
  });

  useEffect(
    () => {
      setState((prev: TState): TState => ({ ...prev, error }));
    },
    [error],
  );

  const onPasswordChange = useCallback(
    (e) => {
      const { value } = e.target;

      setState((prev: TState): TState => ({
        ...prev,
        password: value,
        error: false,
      }));
    },
    [setState],
  );

  const onRepeatedPasswordChange = useCallback(
    (e) => {
      const { value } = e.target;

      setState((prev: TState): TState => ({
        ...prev,
        repeatedPassword: value,
        error: false,
      }));
    },
    [setState],
  );

  function validate(password, repeatedPassword): boolean {
    if (password !== repeatedPassword) {
      return false;
    }

    return true;
  }


  function onSaveClick() {
    const { password, repeatedPassword } = state;

    if (validate(password, repeatedPassword)) {
      onSave(password);
    } else {
      setState((prev: TState): TState => ({
        ...prev,
        error: true,
      }));
    }
  }

  function onCancelClick() {
    setState({
      password: '',
      repeatedPassword: '',
      error: false,
    });
    onCancel();
  }

  return (
    <Dialog
      open={open}
      disableBackdropClick
      disableEscapeKeyDown
      fullScreen={fullScreen}
    >
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
          error={state.error}
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
          error={state.error}
          onChange={onRepeatedPasswordChange}
        />
        {state.error && (
          <Typography
            variant="body2"
            color="error"
          >
            Invalid password!
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onSaveClick}
        >
          Save
        </Button>
        <Button
          onClick={onCancelClick}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withMobileDialog()(BasePasswordDialog);
