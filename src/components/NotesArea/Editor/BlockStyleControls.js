// @flow

import React from 'react';
import type { Node } from 'react';
import { EditorState } from 'draft-js';
import StyleButton from './StyleButton';

export type TProps = $ReadOnly<{
  editorState: EditorState,
  onToggle: (blockType: string) => void,
}>;

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
];


export default function BlockStyleControls(props: TProps): Node {
  const { editorState, onToggle } = props;

  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="note-editor-block-styles">
      {BLOCK_TYPES.map(({ label, style }): Node => (
        <StyleButton
          active={style === blockType}
          key={label}
          label={label}
          style={style}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
