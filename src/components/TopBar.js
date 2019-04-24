// @flow

import React from 'react';
import type { Node } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


export function TopBarComponent(): Node {
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
                <Button variant="contained">Reload</Button>
              </Grid>
              <Grid item>
                <Button variant="contained">Save</Button>
              </Grid>
              <Grid item>
                <Button variant="contained">Change password</Button>
              </Grid>
              <Grid item>
                <Button variant="contained">Delete</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default React.memo<{}>(TopBarComponent);
