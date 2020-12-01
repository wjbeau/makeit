import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AuditionsState } from './audition.state'
import { Audition } from '@makeit/types';

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

export const fetchAudition = createAsyncThunk('auditions/fetchAudition', async (auditionId: string, thunkAPI) => {
  //TODO await call to server with fetch request
  thunkAPI.dispatch(receiveAudition({
      id: "1",
      subject: "Some audition",
      type: "audition",
      startTime: (new Date()).toISOString(),
      endTime: (new Date()).toISOString()
    }))
})

export const saveAudition = createAsyncThunk('auditions/saveAudition', async (audition: Audition, thunkAPI) => {
  //TODO await call to server with post/put request

  if(!audition.id) audition.id = Math.random() + "";
  thunkAPI.dispatch(auditionSaved(audition))
})

export const auditionsSlice = createSlice({
  name: 'auditions',
  initialState,
  reducers: {
    receiveAuditions: (state, action) => {
      state.loading = false;
      state.auditions = action.payload
    },
    receiveAudition: (state, action) => {
      state.loading = false;
      const idx = state.auditions.findIndex(a => a.id === action.payload.id)
      if(idx < 0) {
        state.auditions.push(action.payload)
      }
      else {
        state.auditions.splice(idx, 1, action.payload)
      }
    },
    auditionSaved: (state, action) => {
      state.loading = false;
      const idx = state.auditions.findIndex(a => a.id === action.payload.id)
      if(idx < 0) {
        state.auditions.push(action.payload)
      }
      else {
        state.auditions.splice(idx, 1, action.payload)
      }
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
      .addCase(fetchAudition.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchAudition.rejected, (state, action) => {
        state.auditions = [];
        state.loading = false;
      })
      .addCase(saveAudition.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(saveAudition.rejected, (state, action) => {
        state.loading = false;
      })
  }
});

export const { receiveAuditions, receiveAudition, auditionSaved } = auditionsSlice.actions;

export const selectAuditions = (state: RootState) => state.auditions.auditions;
export const selectAuditionsLoading = (state: RootState) => state.auditions.loading;

export default auditionsSlice.reducer;
