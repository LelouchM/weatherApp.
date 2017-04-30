import { List } from 'immutable';

import { ADD_TO_FAVORITE, REMOVE_FROM_FAVORITE, CHANGE_FAVORITE_ITEM } from './ReducerTypes';

const init = List([]);

export default function (state = init, action) {
  let newState = state;
  switch (action.type) {
    case ADD_TO_FAVORITE:
      newState = state.push(action.payload);
      return newState;

    case REMOVE_FROM_FAVORITE:
      newState = state.remove(action.payload);
      return newState;
    case CHANGE_FAVORITE_ITEM:
      newState = state.set(action.payload.num, action.payload.value);
      return newState;
    default: {
      return newState;
    }
  }
}
