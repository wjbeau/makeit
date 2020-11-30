import { createSlice } from '@reduxjs/toolkit';
import { BreakdownsState } from './breakdowns.state';

const initialState: BreakdownsState = {
  loading: false
};

export const breakdownsSlice = createSlice({
  name: 'breakdowns',
  initialState,
  reducers: {
  }
});

export const { } = breakdownsSlice.actions;

export default breakdownsSlice.reducer;
