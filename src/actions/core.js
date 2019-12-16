import { SUCCESS_SET, SUCCESS_CLEAR, ERROR_SET, ERROR_CLEAR } from '../constants/actionTypes';

export const setSuccessAction = message => ({ type: SUCCESS_SET, message });
export const clearSuccessAction = () => ({ type: SUCCESS_CLEAR });
export const setErrorAction = message => ({ type: ERROR_SET, message });
export const clearErrorAction = () => ({ type: ERROR_CLEAR });
