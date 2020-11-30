import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from '../features/auth/auth.slice';
import loggingReducer from '../features/logging/logging.slice';
import auditionsReducer from '../features/auditions/audition.slice';
import breakdownsReducer from '../features/breakdowns/breakdowns.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    logging: loggingReducer,
    auditions: auditionsReducer,
    breakdowns: breakdownsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
