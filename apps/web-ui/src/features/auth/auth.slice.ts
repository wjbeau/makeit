import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AuthenticationState } from './auth.state'
import { AuthRequest, AuthResponse, RefreshRequest } from '@makeit/types';
import { SERVER_URL, ACTIVE_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../app/config';
import { apiClient } from '../../app/api-client';

const initialState: AuthenticationState = {
  rememberMe: false,
  loading: false
};

export const loginAttempt = createAsyncThunk('auth/loginAttempt', async (userData: AuthRequest): Promise<AuthResponse> => {
  const result = await apiClient().post(SERVER_URL + '/auth/login', userData);
  return result.data;
})

export const refreshToken = createAsyncThunk('auth/refreshToken', async (data: RefreshRequest) => {
  const result = await apiClient().post(SERVER_URL + '/auth/refresh', data);
  return result.data;
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    doLogout: state => {
      state.user = undefined;
      localStorage.removeItem(ACTIVE_TOKEN_KEY);
      state.token = undefined;
      state.refreshToken = undefined;
      state.loading = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginAttempt.pending, (state, action) => {
        state.loading = true;
        state.rememberMe = action.meta.arg.rememberMe;
      })
      .addCase(loginAttempt.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        if(state.rememberMe) {
          localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(state.refreshToken));
        }
        state.loading = false;
      })
      .addCase(loginAttempt.rejected, (state, action) => {
        state.user = undefined;
        localStorage.removeItem(ACTIVE_TOKEN_KEY);
        state.token = undefined;
        state.refreshToken = undefined;
        state.loading = false;
      })
      .addCase(refreshToken.pending, (state, action) => {
        state.refreshActive = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        if(state.rememberMe) {
          localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(state.refreshToken));
        }
        state.refreshActive = false;
      })
  }
});

export const { doLogout } = authSlice.actions;

export const selectAuthed = (state: RootState) => state.auth.user;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export default authSlice.reducer;
