import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './reducers/index';
import App from './App';

const store = (NODE_ENV === 'development')
  ? createStore(reducer, require('redux-devtools-extension').composeWithDevTools(applyMiddleware(thunk)))
  : createStore(reducer, applyMiddleware(thunk));


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
document.getElementById('app'));
