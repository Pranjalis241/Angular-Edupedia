import { createReducer, on } from '@ngrx/store';

import { AuthState, initialState } from './auth.state';
import { loginSuccess, logout } from './auth.action';

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { user }) => ({ ...state, user })),
  on(logout, () => initialState)
);
