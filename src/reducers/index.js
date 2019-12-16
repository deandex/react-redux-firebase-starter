import { combineReducers } from 'redux';
import coreReducer from './core';
import sessionReducer from './session';

const rootReducer = combineReducers({
  coreState: coreReducer,
  sessionState: sessionReducer,
});

export default rootReducer;
