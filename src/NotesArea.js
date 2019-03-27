// @flow

import React from 'react';
import type { Node } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AccessAlarmIcon from '@material-ui/icons/AddCircle';

export default function NotesArea(): Node {
  return (
    <Tabs value="one">
      <Tab value="one" label="Item One" />
      <Tab value="two" label="Item Two" />
      <Tab value="three" label="Item Three" />
      <Tab
        value="add_new_tab"
        icon={(
          <AccessAlarmIcon />
        )}
      />
    </Tabs>
  );
}
