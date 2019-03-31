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
