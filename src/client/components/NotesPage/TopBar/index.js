// @flow

import React, { useCallback } from 'react';
import type { Node } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';


import DesktopToolbar from './desktop-toolbar';
import MobileToolbar from './mobile-toolbar';

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

  const onDelete = useCallback(
    (): void => send('DELETE'),
    [send],
  );

  function isSaveDisabled(): boolean {
    return !(state.matches('NEW') || state.matches('MODIFIED'));
  }

  function isDeleteDisabled(): boolean {
    return !(state.matches('SAVED') || state.matches('MODIFIED'));
  }

  function isChgPasswdDisabled(): boolean {
    return !(state.matches('SAVED') || state.matches('MODIFIED'));
  }

  return (
    <AppBar position="relative">
      <Toolbar>
        <Hidden mdDown>
          <DesktopToolbar
            onSave={onSave}
            onChangePassword={onChangePassword}
            onDelete={onDelete}
            isSaveDisabled={isSaveDisabled()}
            isDeleteDisabled={isDeleteDisabled()}
            isChgPasswdDisabled={isChgPasswdDisabled()}
          />
        </Hidden>
        <Hidden mdUp>
          <MobileToolbar
            onSave={onSave}
            onChangePassword={onChangePassword}
            onDelete={onDelete}
            isSaveDisabled={isSaveDisabled()}
            isDeleteDisabled={isDeleteDisabled()}
            isChgPasswdDisabled={isChgPasswdDisabled()}
          />
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

export default React.memo<TProps>(TopBarComponent);
