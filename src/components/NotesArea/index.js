// @flow

import React from 'react';
import type { Node } from 'react';

import TabsLine from './TabsLine';
import Editor from './Editor';

export type TProps = $ReadOnly<{
  notes: TNotes,
  currentNote: TNote,
  onNewNote: () => void,
  onRemoveNote: (id: string) => void,
  onUpdateNote: (note: TNote) => void,
  onChangeCurrent: (newId: string) => void,
}>;

export function NotesAreaComponent(props: TProps): Node {
  const {
    notes,
    currentNote,
    onNewNote,
    onUpdateNote,
    onRemoveNote,
    onChangeCurrent,
  } = props;

  return (
    <React.Fragment>
      <TabsLine
        notes={notes}
        currentNoteId={currentNote.id}
        onNewNote={onNewNote}
        onRemoveNote={onRemoveNote}
        onChangeCurrent={onChangeCurrent}
      />
      <Editor
        note={currentNote}
        onChange={onUpdateNote}
      />
    </React.Fragment>
  );
}

export default React.memo<TProps>(NotesAreaComponent);
