// @flow

import React, { useState } from 'react';
import type { Node } from 'react';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export type TProps = $ReadOnly<{
  onSave: () => void,
  onChangePassword: () => void,
  onDelete: () => void,
  isSaveDisabled: boolean,
  isDeleteDisabled: boolean,
  isChgPasswdDisabled: boolean,
}>;

export default function MobileToolbar(props: TProps): Node {
  const {
    onSave,
    onChangePassword,
    onDelete,
    isSaveDisabled,
    isDeleteDisabled,
    isChgPasswdDisabled,
  } = props;

  const [isOpen, setOpen] = useState(false);

  function onToggleMenu() {
    setOpen(!isOpen);
  }

  function onSaveClk() {
    onSave();
    setOpen(false);
  }

  function onDeleteClk() {
    onDelete();
    setOpen(false);
  }

  function onChgPasswdClk() {
    onChangePassword();
    setOpen(false);
  }


  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item xs={2}>
          <IconButton
            color="inherit"
            onClick={onToggleMenu}
          >
            <MenuIcon />
          </IconButton>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="h6" color="inherit">
            Protected Text
          </Typography>
        </Grid>
      </Grid>
      <Drawer
        open={isOpen}
        onClose={onToggleMenu}
      >
        <List>
          <ListItem
            button
            onClick={onSaveClk}
            disabled={isSaveDisabled}
          >
            <ListItemText>
              Save
            </ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={onChgPasswdClk}
            disabled={isChgPasswdDisabled}
          >
            <ListItemText>
              Change password
            </ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={onDeleteClk}
            disabled={isDeleteDisabled}
          >
            <ListItemText>
              Delete
            </ListItemText>
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  );
}
