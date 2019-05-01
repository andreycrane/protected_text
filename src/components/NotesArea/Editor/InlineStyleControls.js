// @flow

import React from 'react';
import type { Node } from 'react';
import { EditorState } from 'draft-js';

import StyleButton from './StyleButton';

export type TProps = $ReadOnly<{
  onToggle: (inlineStyle: string) => void,
  editorState: EditorState,
}>;

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];


export default function InlineStyleControls(props: TProps): Node {
  const { editorState, onToggle } = props;
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className="note-editor-inline-styles">
      {INLINE_STYLES.map(({ label, style }): Node => (
        <StyleButton
          active={currentStyle.has(style)}
          key={label}
          label={label}
          style={style}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
