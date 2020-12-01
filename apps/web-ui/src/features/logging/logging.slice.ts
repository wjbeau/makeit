import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ApplicationMessages } from './logging.state';


const initialState: ApplicationMessages = {
  messages: []
};

export const loggingSlice = createSlice({
  name: 'logging',
  initialState,
  reducers: {
    logSuccess: (state, action) => {
      const msg = action.payload
      state.messages.push({
        type: "success",
        message: JSON.stringify(msg),
        args: []
      });
    },
    logInfo: (state, action) => {
      const msg = action.payload
      state.messages.push({
        type: "info",
        message: JSON.stringify(msg),
        args: []
      });
    },
    logWarn: (state, action) => {
      const msg = action.payload
      state.messages.push({
        type: "warn",
        message: JSON.stringify(msg),
        args: []
      });
    },
    logDebug: (state, action) => {
      const msg = action.payload
      state.messages.push({
        type: "debug",
        message: JSON.stringify(msg),
        args: []
      });
    },
    logError: (state, action) => {
      const msg = action.payload
      state.messages.push({
        type: "error",
        message: JSON.stringify(msg),
        args: []
      });
    },
    messageHandled: (state, action) => {
      const msg = action.payload
      const index = state.messages.indexOf(msg);
      if (index > -1) {
        state.messages.splice(index, 1);
      }
    },
  }
});

export const { logInfo, logWarn, logDebug, logError, messageHandled } = loggingSlice.actions;

export const selectErrors = (state: RootState) => state.logging.messages.filter(m => m.type === "error");
export const selectInfo = (state: RootState) => state.logging.messages.filter(m => m.type === "info");
export const selectWarn = (state: RootState) => state.logging.messages.filter(m => m.type === "warn");
export const selectDebug = (state: RootState) => state.logging.messages.filter(m => m.type === "debug");
export const selectSuccess = (state: RootState) => state.logging.messages.filter(m => m.type === "success");

export default loggingSlice.reducer;
