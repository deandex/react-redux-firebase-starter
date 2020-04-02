import { clearSuccessAction, setSuccessAction, clearErrorAction, setErrorAction } from '../core/actions';
import { updateAuthUserAction } from '../auth/actions';

import { MSG_PROFILE_UPDATED, MSG_PASSWORD_UPDATED } from '../../global/messages';
import { LOCAL_STORAGE_PREFIX } from '../../global/environment';

function updateProfileAction(data, firebase) {
  return (dispatch, getState) => {
    dispatch(clearSuccessAction());
    dispatch(clearErrorAction());

    return firebase.userProvider.doUpdateUserProfile(data).then(
      (result) => {
        dispatch(updateAuthUserAction(result));
        dispatch(setSuccessAction(MSG_PROFILE_UPDATED));

        localStorage.setItem(LOCAL_STORAGE_PREFIX, JSON.stringify(getState().sessionState.authUser));
      },
      (error) => dispatch(setErrorAction(error.message)),
    );
  };
}

function updatePasswordAction(data, firebase) {
  return (dispatch) => {
    dispatch(clearSuccessAction());
    dispatch(clearErrorAction());

    return firebase.doVerifyPassword(data).then(
      () => {
        dispatch(setSuccessAction(MSG_PASSWORD_UPDATED));
      },
      (error) => dispatch(setErrorAction(error.message)),
    );
  };
}

export { updateProfileAction, updatePasswordAction };
