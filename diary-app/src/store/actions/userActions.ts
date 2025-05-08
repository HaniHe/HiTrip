// src/store/actions/userActions.ts

import { SET_USER, UPDATE_USER, CLEAR_USER } from "../actionTypes/userActionTypes";

// Define User interface
interface User {
  id?: string;
  username?: string;
  email?: string;
  [key: string]: any; // for other potential user properties
}

// Action to set user information
export const setUser = (user: User) => ({
  type: SET_USER,
  payload: user,
});

// Action to update user information
export const updateUser = (updates: Partial<User>) => ({
  type: UPDATE_USER,
  payload: updates,
});

// Action to clear user information
export const clearUser = () => ({
  type: CLEAR_USER,
});