// @flow

import React, { useCallback } from 'react';
import type { Node } from 'react';

import TabsLine from './TabsLine';
import Editor from './Editor';

export type TProps = $ReadOnly<{
  state: mixed,
  send: () => void,
}>;

export function NotesAreaComponent(props: TProps): Node {
  const { state, send } = props;

  const onNewNote = useCallback((): void => send('NEW_NOTE'));
  const onRemoveNote = useCallback((id: string): void => send({ type: 'REMOVE_NOTE', id }));
  const onChangeCurrent = useCallback((newId: string): void => send({ type: 'CHANGE_CURRENT', newId }));
  const onUpdateNote = useCallback((note: TNote): void => send({ type: 'UPDATE_NOTE', note }));

  if (Array.isArray(state.context.notes) === false) {
    return (
      <h2>{'There aren\'t any notes yet'}</h2>
    );
  }

  const { notes, currentId } = state.context;
  const currentNote = notes.find(n => n.id === currentId);

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
