import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from '../features/auth/auth.slice';
import messageReducer from '../features/message/message.slice';
import meetingsReducer from '../features/meetings/meetings.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
    meetings: meetingsReducer
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
