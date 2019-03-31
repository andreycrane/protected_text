// @flow

export type TNote = $ReadOnly<{
  id: string,
  label: string,
  rawContent: mixed,
}>;

export type TNotes = $ReadOnlyArray<TNote>;

export type TTab = $ReadOnly<{
  id: string,
  label: string,
}>;

export type TTabs = $ReadOnlyArray<TTab>;
