// @flow

import React from 'react';
import type { Node } from 'react';

import BasePasswordDialog from './BasePasswordDialog';

export default function ChangePasswordDialog(): Node {
  return (
    <BasePasswordDialog
      open={false}
      title="Change password"
      text="Enter new password and click Save. Longer passwords are more secure."
    />
  );
}
