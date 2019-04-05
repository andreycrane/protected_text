// @flow

export default function initContext(initialNotes) {
  if (initialNotes.length === 0) {
    return {
      notes: [],
      currentId: null,
    };
  }

  return {
    notes: initialNotes,
    currentId: initialNotes[0].id,
  };
}
