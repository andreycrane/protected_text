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


declare type TContext = $ReadOnly<{
  name: string,
  encrypted: string | null,
  currentId: string | null,
  password: string | null,
  notes: TNotes | null,
}>;

declare type TPlain = $ReadOnly<{
  [string]: string | number | boolean | TNote | TPlain,
}>;

declare type TEvent = $ReadOnly<{
  type: string,
  ...TPlain,
}>;
