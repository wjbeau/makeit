import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AuthenticationState } from './auth.state'
import { AuthRequest } from '@makeit/types';
import { SERVER_URL } from '../../app/config';
import { axiosInstance } from '../../app/axios';

const initialState: AuthenticationState = {
  loading: false
};

export const loginAttempt = createAsyncThunk('auth/loginAttempt', async (userData: AuthRequest) => {
  const result = await axiosInstance().post(SERVER_URL + '/auth/login', userData);
  return result.data;
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    doLogout: state => {
      state.user = undefined;
      state.loading = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginAttempt.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginAttempt.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.loading = false;
      })
      .addCase(loginAttempt.rejected, (state, action) => {
        state.user = undefined;
        state.loading = false;
      })
  }
});

export const { doLogout } = authSlice.actions;

export const selectAuthed = (state: RootState) => state.auth.user;
export const selectLoading = (state: RootState) => state.auth.loading;

export default authSlice.reducer;
