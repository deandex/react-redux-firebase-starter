import { combineReducers } from 'redux';
import coreReducer from '../../services/core/reducer';
import sessionReducer from '../../services/auth/reducer';

const rootReducer = combineReducers({
  coreState: coreReducer,
  sessionState: sessionReducer,
});

export default rootReducer;
