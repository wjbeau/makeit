import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from '../features/auth/auth.slice';
import loggingReducer from '../features/logging/logging.slice';
import auditionsReducer from '../features/auditions/audition.slice';
import breakdownsReducer from '../features/breakdowns/breakdowns.slice';
import filesReducer from '../features/files/files.slice';
import contactsReducer from '../features/contacts/contact.slice';
import projectsReducer from '../features/projects/project.slice';
import calendarReducer from '../features/calendar/calendar.slice';
import financeReducer from '../features/finance/finance.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    logging: loggingReducer,
    auditions: auditionsReducer,
    breakdowns: breakdownsReducer,
    files: filesReducer,
    contacts: contactsReducer,
    projects: projectsReducer,
    calendar: calendarReducer,
    finance: financeReducer
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
