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
        message: msg.message,
        args: []
      });
    },
    logInfo: (state, action) => {
      const msg = action.payload
      state.messages.push({
        type: "info",
        message: msg.message,
        args: []
      });
    },
    logWarn: (state, action) => {
      const msg = action.payload
      state.messages.push({
        type: "warn",
        message: msg.message,
        args: []
      });
    },
    logDebug: (state, action) => {
      const msg = action.payload
      state.messages.push({
        type: "debug",
        message: msg.message,
        args: []
      });
    },
    logError: (state, action) => {
      const msg = action.payload
      state.messages.push({
        type: "error",
        message: msg.message,
        args: []
      });
    },
    messagesHandled: (state, action) => {
      const msgs = action.payload
      msgs.forEach(msg => {
        const index = state.messages.findIndex((m) => m.message === msg.message);
        if (index > -1) {
          state.messages.splice(index, 1);
        }
      });
    },
  }
});

export const { logInfo, logWarn, logDebug, logError, messagesHandled } = loggingSlice.actions;

export const selectMessages = (state: RootState) => state.logging.messages;
export const selectErrors = (state: RootState) => state.logging.messages.filter(m => m.type === "error");
export const selectInfo = (state: RootState) => state.logging.messages.filter(m => m.type === "info");
export const selectWarn = (state: RootState) => state.logging.messages.filter(m => m.type === "warn");
export const selectDebug = (state: RootState) => state.logging.messages.filter(m => m.type === "debug");
export const selectSuccess = (state: RootState) => state.logging.messages.filter(m => m.type === "success");

export default loggingSlice.reducer;
