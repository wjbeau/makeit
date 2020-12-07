import { Audition } from '@makeit/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../app/api-client';
import { RootState } from '../../app/store';
import { AuditionsState } from './audition.state';

const initialState: AuditionsState = {
  auditions: [],
  loading: false
};

export const fetchAuditions = createAsyncThunk('auditions/fetchAuditions', async (userId: string, thunkAPI) => {
  const result = await apiClient().get('/auditions');
  thunkAPI.dispatch(receiveAuditions(result.data))
})

export const fetchAudition = createAsyncThunk('auditions/fetchAudition', async (auditionId: string, thunkAPI) => {
  const result = await apiClient().get('/auditions/' + auditionId);
  thunkAPI.dispatch(receiveAudition(result.data))
})

export const saveAudition = createAsyncThunk('auditions/saveAudition', async (audition: Audition, thunkAPI) => {
  if(audition._id) {
    const result = await apiClient().put('/auditions/' + audition._id);
    thunkAPI.dispatch(auditionSaved(result.data))
  }
  else {
    const result = await apiClient().post('/auditions', audition);
    thunkAPI.dispatch(auditionSaved(result.data))
  }
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
      const idx = state.auditions.findIndex(a => a._id === action.payload._id)
      if(idx < 0) {
        state.auditions.push(action.payload)
      }
      else {
        state.auditions.splice(idx, 1, action.payload)
      }
    },
    auditionSaved: (state, action) => {
      state.loading = false;
      const idx = state.auditions.findIndex(a => a._id === action.payload._id)
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
