// @flow

import React, { useCallback } from 'react';
import type { Node } from 'react';

import BasePasswordDialog from './BasePasswordDialog';

export type TProps = $ReadOnly<{
  state: mixed,
  send: (args: mixed) => void,
}>;

export default function ChangePasswordDialog(props: TProps): Node {
  const { state, send } = props;

  const onSave = useCallback(
    (password: string): void => send({ type: 'CREATE', password }),
    [send],
  );

  const onCancel = useCallback(
    (): void => send('CANCEL'),
    [send],
  );

  return (
    <BasePasswordDialog
      open={state.matches('CHANGE_PASSWORD')}
      title="Change password"
      text="Enter new password and click Save. Longer passwords are more secure."
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}
