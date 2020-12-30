import { UserAccount } from '@makeit/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PasswordChangeRequest } from '../../../../../libs/types/src/user.model';
import { apiClient } from '../../app/api-client';
import {
  SERVER_URL
} from '../../app/config';
import { RootState } from '../../app/store';
import { UserState } from './user.state';

const initialState: UserState = {
  user: null,
  busy: false
}

export const saveAccount = createAsyncThunk(
  'user/saveAccount',
  async (user: UserAccount, thunkApi): Promise<UserAccount> => {
    const result = await apiClient().put(SERVER_URL + '/users/' + user._id, user);
    thunkApi.dispatch(userSet(result.data))
    return result.data;
  }
);

export const registerAccount = createAsyncThunk(
  'user/registerAccount',
  async (user: UserAccount): Promise<UserAccount> => {
    const result = await apiClient().post(SERVER_URL + '/users/', user);
    return result.data;
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (changeRequest: PasswordChangeRequest): Promise<UserAccount> => {
    const result = await apiClient().put(SERVER_URL + '/users/' 
      + changeRequest.userid + '/password', changeRequest);
    return result.data;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userSet: (state, action) => {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveAccount.pending, (state, action) => {
        state.busy = true;
      })
      .addCase(saveAccount.rejected, (state, action) => {
        state.busy = false;
      })
      .addCase(saveAccount.fulfilled, (state, action) => {
        state.busy = false;
      })
      .addCase(registerAccount.pending, (state, action) => {
        state.busy = true;
      })
      .addCase(registerAccount.rejected, (state, action) => {
        state.busy = false;
      })
      .addCase(registerAccount.fulfilled, (state, action) => {
        state.busy = false;
      })
      .addCase(changePassword.pending, (state, action) => {
        state.busy = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.busy = false;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.busy = false;
      })
  },
});

export const { userSet } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectUserActivityBusy = (state: RootState) => state.user.busy;

export default userSlice.reducer;
