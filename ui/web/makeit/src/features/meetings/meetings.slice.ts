import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { MeetingsState } from './meetings.state'

const initialState: MeetingsState = {
  meetings: [],
  loading: false
};

export const fetchMeetings = createAsyncThunk('meetings/fetchMeetings', async (user: string, thunkAPI) => {
  //TODO await call to server with fetch request
  thunkAPI.dispatch(receiveMeetings([
    {
      id: "1",
      subject: "Some meeting",
      type: "audition",
      startTime: (new Date()).toISOString(),
      endTime: (new Date()).toISOString()
    },
    {
      id: "2",
      subject: "Some other meeting",
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

export const meetingsSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    receiveMeetings: (state, action) => {
      state.loading = false;
      state.meetings = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMeetings.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.meetings = [];
        state.loading = false;
      })
  }
});

export const { receiveMeetings } = meetingsSlice.actions;

export const selectMeetings = (state: RootState) => state.meetings.meetings;
export const selectMeetingsLoading = (state: RootState) => state.meetings.loading;

export default meetingsSlice.reducer;
