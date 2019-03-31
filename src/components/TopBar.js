// @flow

import React from 'react';
import type { Node } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import LockOpen from '@material-ui/icons/LockOpen';

export function TopBarComponent(): Node {
  return (
    <AppBar position="relative">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Protected Text
        </Typography>
        <IconButton>
          <LockOpen />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default React.memo<{}>(TopBarComponent);
