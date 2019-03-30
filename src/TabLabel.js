// @flow

import React from 'react';
import type { Node } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import DeleteForever from '@material-ui/icons/DeleteForever';

export type TProps = $ReadOnly<{
  id: string,
  label: string,
  onRemove: (id: string) => void,
}>;

export default function TabLabel(props: TProps): Node {
  const { id, label, onRemove } = props;

  function handleRemoveClick(event): boolean {
    event.preventDefault();
    event.stopPropagation();

    onRemove(id);

    return false;
  }

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      <Grid item xs={9}>
        {label}
      </Grid>
      <Grid item xs={3}>
        <IconButton
          onClick={handleRemoveClick}
        >
          <DeleteForever
            fontSize="small"
          />
        </IconButton>
      </Grid>
    </Grid>
  );
}
