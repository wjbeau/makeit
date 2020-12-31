import { Attachment } from '@makeit/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../app/api-client';
import { SERVER_URL } from '../../app/config';

const initialState = {
  uploading: false,
};

export const downloadFile = createAsyncThunk(
  'files/download',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (fileId: string): Promise<File> => {
    const result = await apiClient().get(SERVER_URL + '/files/' + fileId, {
      responseType: 'blob',
    });
    return result.data;
  }
);

export const uploadFile = createAsyncThunk(
  'files/upload',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (upload: any): Promise<Attachment> => {
    const fd = new FormData();
    if (upload.description) {
      fd.append('displayName', upload.description);
    }
    fd.append('attachmentType', upload.attachmentType);
    fd.append('file', upload.file);
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
