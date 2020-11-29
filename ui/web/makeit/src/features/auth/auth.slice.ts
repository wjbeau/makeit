import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AuthenticationState, AuthRequest } from './auth.state'

const initialState: AuthenticationState = {
  loading: false
};

export const loginAttempt = createAsyncThunk('auth/loginAttempt', async (userData: AuthRequest) => {
  //TODO await call to server with auth request
  return {
    userId: "user1",
    firstName: "Will",
    lastName: "Beaumont"
  }
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
        state.user = {
          userId: action.payload.userId,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          profiles: []
        }
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
