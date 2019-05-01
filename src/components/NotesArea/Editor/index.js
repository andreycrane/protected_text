// @flow

import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  RichUtils,
} from 'draft-js';

import type { RawDraftContentState } from 'draft-js/lib/RawDraftContentState';

import InlineStyleConrtols from './InlineStyleControls';
import BlockStyleConrtols from './BlockStyleControls';

import './styles.css';

function getEditorState(note: TNote): EditorState {
  const contentState = convertFromRaw(note.rawContent);
  return EditorState.createWithContent(contentState);
}

function getRawContent(editorState): RawDraftContentState {
  const currentContent = editorState.getCurrentContent();
  return convertToRaw(currentContent);
}

export type TProps = $ReadOnly<{
  note: TNote,
  onChange: (note: TNote) => void,
}>;

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

  function toggleBlockType(blockType) {
    onEditorChange(
      RichUtils.toggleBlockType(
        state.editorState,
        blockType,
      ),
    );
  }

  function toggleInlineStyle(inlineStyle) {
    onEditorChange(
      RichUtils.toggleInlineStyle(
        state.editorState,
        inlineStyle,
      ),
    );
  }

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  return (
    <div className="note-editor">
      <BlockStyleConrtols
        editorState={state.editorState}
        onToggle={toggleBlockType}
      />
      <InlineStyleConrtols
        editorState={state.editorState}
        onToggle={toggleInlineStyle}
      />
      <Editor
        editorState={state.editorState}
        onChange={onEditorChange}
        handleKeyCommand={handleKeyCommand}
      />
    </div>
  );
}
