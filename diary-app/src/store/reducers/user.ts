// src/store/reducers/user.ts

import { SET_USER, UPDATE_USER, CLEAR_USER } from "../actionTypes/userActionTypes";

interface User {
  id?: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userReducer = (state = initialState, action: { type: string; payload?: any }): UserState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default userReducer;