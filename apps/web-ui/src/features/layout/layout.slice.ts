import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { LayoutState } from './layout.state';

const initialState: LayoutState = {
    drawerOpen: false
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setDrawerOpen: (state, action) => {
      state.drawerOpen = action.payload;
    },
  }
});

export const { setDrawerOpen } = layoutSlice.actions;

export const selectDrawerOpen = (state: RootState) => state.layout.drawerOpen;

export default layoutSlice.reducer;
