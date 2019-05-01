// @flow

import React, { useCallback } from 'react';
import type { Node } from 'react';

export type TProps = $ReadOnly<{
  label: string,
  style: string,
  active: boolean,
  onToggle: (style: string) => void,
}>;

export default function StyleButton(props: TProps): Node {
  const {
    label,
    active,
    style,
    onToggle,
  } = props;


  const onToggleClick = useCallback(
    (e) => {
      e.preventDefault();

      onToggle(style);
    },
    [onToggle],
  );

  return (
    <button
      className={`note-editor-style-button ${active ? 'note-editor-style-button-active' : ''}`}
      type="button"
      onClick={onToggleClick}
    >
      {label}
    </button>
  );
}
