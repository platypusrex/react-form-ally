import { FormValues } from '../types';

type Subscribe<TValues extends FormValues<any>> = (e: TValues) => void;

export function createStore<TState extends FormValues<any>>(
  initialState: TState = Object.assign({})
) {
  let state = initialState;
  const subscribers: Set<Subscribe<TState>> = new Set();

  return {
    getSnapshot() {
      return state;
    },
    setState(nextState: TState | ((prevState: TState) => TState)) {
      const ns = typeof nextState === 'function' ? nextState(state) : nextState;
      state = { ...state, ...ns };
      return this;
    },
    setStateAndEmit(nextState: TState | ((prevState: TState) => TState)) {
      const ns = typeof nextState === 'function' ? nextState(state) : nextState;
      state = { ...state, ...ns };
      subscribers.forEach((fn) => fn(state));
    },
    emit(shouldEmit = true) {
      shouldEmit && subscribers.forEach((fn) => fn(this.getSnapshot()));
    },
    subscribe(fn: Subscribe<TState>) {
      subscribers.add(fn);
      return () => {
        subscribers.delete(fn);
      };
    },
  };
}
