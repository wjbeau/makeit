import { Attachment } from '@makeit/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../app/api-client';
import { SERVER_URL } from '../../app/config';

const initialState = {
  uploading: false,
};

export const uploadFile = createAsyncThunk(
  'files/upload',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (file: any): Promise<Attachment> => {
    const fd = new FormData();
    fd.append('file',file)
    const result = await apiClient({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).post(SERVER_URL + '/files', fd);
    return result.data;
  }
);

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state, action) => {
        state.uploading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
      });
  },
});

export default filesSlice.reducer;
