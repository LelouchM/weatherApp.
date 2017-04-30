import { combineReducers } from 'redux';

import mainReducer from './mainReducer';
import favoriteReducer from './favoriteReducer';

export default combineReducers({
  mainReducer,
  favoriteReducer,
});
