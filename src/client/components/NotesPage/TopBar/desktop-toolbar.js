// @flow

import React from 'react';
import type { Node } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export type TProps = $ReadOnly<{
  onSave: () => void,
  onChangePassword: () => void,
  onDelete: () => void,
  isSaveDisabled: boolean,
  isDeleteDisabled: boolean,
  isChgPasswdDisabled: boolean,
}>;

export default function DesctopToolbar(props: TProps): Node {
  const {
    onSave,
    onChangePassword,
    onDelete,
    isSaveDisabled,
    isDeleteDisabled,
    isChgPasswdDisabled,
  } = props;

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      <Grid item xs={2}>
        <Typography variant="h6" color="inherit">
          Protected Text
        </Typography>
      </Grid>
      <Grid item xs={10}>
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="center"
          spacing={8}
        >
          <Grid item>
            <Button
              variant="contained"
              disabled={isSaveDisabled}
              onClick={onSave}
            >
                Save
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              disabled={isChgPasswdDisabled}
              onClick={onChangePassword}
            >
              Change password
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              disabled={isDeleteDisabled}
              onClick={onDelete}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
