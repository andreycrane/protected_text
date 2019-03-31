// @flow

import React from 'react';
import type { Node } from 'react';

import BasePasswordDialog from './BasePasswordDialog';

export default function CreatePasswordDialog(): Node {
  return (
    <BasePasswordDialog
      open={false}
      title="Create password"
      text="Longer passwords are more secure."
    />
  );
}
