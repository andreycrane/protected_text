// @flow

import React from 'react';
import type { Node } from 'react';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';

export default function MobileToolbar(): Node {
  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      <Grid item xs={2}>
        <IconButton>
          <MenuIcon />
        </IconButton>
      </Grid>
      <Grid item xs={10}>
        <Typography variant="h6" color="inherit">
          Protected Text
        </Typography>
      </Grid>
    </Grid>
  );
}
