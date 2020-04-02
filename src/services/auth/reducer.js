import { AUTH_USER_SET, AUTH_USER_UPDATE } from './types';

const INITIAL_STATE = {
  authUser: null,
};

const applySetAuthUser = (state, action) => ({
  ...state,
  authUser: action.authUser,
});

const applyUpdateAuthUser = (state, action) => {
  const updatedData = {
    ...state.authUser,
    displayName: `${action.firstName} ${action.lastName}`,
    firstName: action.firstName,
    lastName: action.lastName,
    location: action.location,
    jobTitle: action.jobTitle,
    avatar: action.avatar,
  };

  return {
    ...state,
    authUser: updatedData,
  };
};

function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER_SET:
      return applySetAuthUser(state, action);
    case AUTH_USER_UPDATE:
      return applyUpdateAuthUser(state, action.payload);
    default:
      return state;
  }
}

export default sessionReducer;
