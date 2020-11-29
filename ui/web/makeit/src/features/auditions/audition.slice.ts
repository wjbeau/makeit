import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AuditionsState } from './audition.state'

const initialState: AuditionsState = {
  auditions: [],
  loading: false
};

export const fetchAuditions = createAsyncThunk('auditions/fetchAuditions', async (user: string, thunkAPI) => {
  //TODO await call to server with fetch request
  thunkAPI.dispatch(receiveAuditions([
    {
      id: "1",
      subject: "Some audition",
      type: "audition",
      startTime: (new Date()).toISOString(),
      endTime: (new Date()).toISOString()
    },
    {
      id: "2",
      subject: "Some other audition",
      type: "audition",
      startTime: (new Date()).toISOString(),
      endTime: (new Date()).toISOString()
    },
    {
      id: "3",
      subject: "My big callback!",
      type: "callback",
      startTime: (new Date()).toISOString(),
      endTime: (new Date()).toISOString()
    }
  ]))
})

export const auditionsSlice = createSlice({
  name: 'auditions',
  initialState,
  reducers: {
    receiveAuditions: (state, action) => {
      state.loading = false;
      state.auditions = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAuditions.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchAuditions.rejected, (state, action) => {
        state.auditions = [];
        state.loading = false;
      })
  }
});

export const { receiveAuditions } = auditionsSlice.actions;

export const selectAuditions = (state: RootState) => state.auditions.auditions;
export const selectAuditionsLoading = (state: RootState) => state.auditions.loading;

export default auditionsSlice.reducer;
