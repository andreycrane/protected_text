// @flow

import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';

import type { TNote } from './types';

export type TProps = $ReadOnly<{
  note: TNote,
  onChange: (note: TNote) => void,
}>;

function getEditorState(note: TNote) {
  const contentState = convertFromRaw(note.rawContent);
  return EditorState.createWithContent(contentState);
}

function getRawContent(editorState) {
  const currentContent = editorState.getCurrentContent();
  return convertToRaw(currentContent);
}

export default function NoteEditor(props: TProps): Node {
  const { note, onChange } = props;

  const [state, setState] = useState({
    id: note.id,
    editorState: getEditorState(note),
  });

  useEffect(
    () => {
      if (state.id !== note.id) {
        setState({
          id: note.id,
          editorState: getEditorState(note),
        });
      }
    },
    [note.id],
  );

  function onEditorChange(editorState) {
    setState({
      id: note.id,
      editorState,
    });

    onChange({
      ...note,
      rawContent: getRawContent(editorState),
    });
  }

  return (
    <Editor
      editorState={state.editorState}
      onChange={onEditorChange}
    />
  );
}
