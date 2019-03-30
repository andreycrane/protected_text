// @flow

export type TNote = {
  id: string,
  label: string,
  rawContent: mixed,
};

export type TNotes = $ReadOnlyArray<TNote>;
