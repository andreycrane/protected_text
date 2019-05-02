// @flow

import React, { useCallback } from 'react';
import type { Node } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { hasPassword } from '../../machine/guards';

export type TProps = $ReadOnly<{
  state: mixed,
  send: (args: mixed) => void,
}>;

export function TopBarComponent(props: TProps): Node {
  const { state, send } = props;

  const onSave = useCallback(
    (): void => send('SAVE'),
    [send],
  );

  const onChangePassword = useCallback(
    (): void => send('CHANGE_PASSWORD'),
    [send],
  );

  return (
    <AppBar position="relative">
      <Toolbar>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={1}>
            <Typography variant="h6" color="inherit">
              Protected Text
            </Typography>
          </Grid>
          <Grid item xs={11}>
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
                  disabled={!state.matches('MODIFIED')}
                  onClick={onSave}
                >
                    Save
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  disabled={!hasPassword(state.context)}
                  onClick={onChangePassword}
                >
                  Change password
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default React.memo<TProps>(TopBarComponent);
