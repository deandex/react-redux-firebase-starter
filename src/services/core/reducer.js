import { SUCCESS_SET, SUCCESS_CLEAR, ERROR_SET, ERROR_CLEAR } from './types';

const INITIAL_STATE = {
  error: null,
  success: null,
};

function coreReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SUCCESS_SET:
      return { ...state, success: action.message };
    case SUCCESS_CLEAR:
      return { ...state, success: null };
    case ERROR_SET:
      return { ...state, error: action.message };
    case ERROR_CLEAR:
      return { ...state, error: null };
    default:
      return state;
  }
}

export default coreReducer;
