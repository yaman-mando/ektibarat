const patchState = <T extends object>(
  state: T,
  partialState: Partial<T> | ((state: T) => void)
) => {
  if (typeof partialState === 'function') {
    partialState(state);
  } else {
    Object.assign(state, partialState);
  }
};

export const createPatchState = <T extends object>(state: T) => {
  return (partialState: Partial<T> | ((state: T) => void)) =>
    patchState(state, partialState);
};
