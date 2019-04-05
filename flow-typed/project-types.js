// @flow

import type { RawDraftContentState } from 'draft-js/lib/RawDraftContentState';

declare type TNote = $ReadOnly<{
  id: string,
  label: string,
  rawContent: RawDraftContentState,
}>;

declare type TNotes = $ReadOnlyArray<TNote>;

declare type TStyles = $ReadOnly<{
  [string]: string | TStyles,
}>;

export type TState = $ReadOnly<{
  notes: TNotes,
  currentId: string | null,
}>;

export type TAction =
  $ReadOnly<{ type: 'NEW_NOTE' }> |
  $ReadOnly<{ type: 'UPDATE_NOTE', note: TNote }> |
  $ReadOnly<{ type: 'REMOVE_NOTE', id: string }> |
  $ReadOnly<{ type: 'CHANGE_CURRENT', newId: string }>;
