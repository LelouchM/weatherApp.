import { Map } from 'immutable';

import { SUCSESS_FETCH_INFORMATION, FAIL_FETCH_INFORMATION, CLOSE_FETCH_ERROR } from './ReducerTypes';

const init = Map({
  FetchError: {
    text: '',
    show: false,
  },
  cityInformation: Map(),
});

export default function (state = init, action) {
  let newState = state;
  switch (action.type) {
    case SUCSESS_FETCH_INFORMATION:
      newState = state.set('cityInformation', Map(action.payload));
      return newState;

    case FAIL_FETCH_INFORMATION:
      newState = state.set('FetchError', action.payload);
      return newState;

    case CLOSE_FETCH_ERROR:
      newState = state.set('FetchError', action.payload);
      return newState;

    default: {
      return newState;
    }
  }
}
