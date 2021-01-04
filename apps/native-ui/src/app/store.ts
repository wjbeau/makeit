import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer, { refreshToken } from './auth/auth.slice';
import auditionsReducer from './auditions/audition.slice';
import projectsReducer from './projects/project.slice';
import userReducer from './users/user.slice';
import financeReducer from './finance/finance.slice';
import { initApiClient } from './api-client';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    auditions: auditionsReducer,
    projects: projectsReducer,
    finance: financeReducer,
    user: userReducer
  },
});

//set up the auth interceptors
initApiClient(store, refreshToken);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
