import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import mainReducer from './mainReducer';
import favoriteReducer from './favoriteReducer';

export default combineReducers({
  routing: routerReducer,
  mainReducer,
  favoriteReducer,
});
