import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ApplicationMessages } from './message.state';


const initialState: ApplicationMessages = {
  messages: []
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    logInfo: (state, action) => {
      let msg = action.payload
      state.messages.push({
        type: "info",
        message: msg,
        args: []
      });
    },
    logWarn: (state, action) => {
      let msg = action.payload
      state.messages.push({
        type: "warn",
        message: msg,
        args: []
      });
    },
    logDebug: (state, action) => {
      let msg = action.payload
      state.messages.push({
        type: "debug",
        message: msg,
        args: []
      });
    },
    logError: (state, action) => {
      let msg = action.payload
      state.messages.push({
        type: "error",
        message: msg,
        args: []
      });
    },
    messageHandled: (state, action) => {
      let msg = action.payload
      const index = state.messages.indexOf(msg);
      if (index > -1) {
        state.messages.splice(index, 1);
      }
    },
  }
});

export const { logInfo, logWarn, logDebug, logError, messageHandled } = messageSlice.actions;

export const selectErrors = (state: RootState) => state.message.messages.filter(m => m.type === "error");
export const selectInfo = (state: RootState) => state.message.messages.filter(m => m.type === "info");
export const selectWarn = (state: RootState) => state.message.messages.filter(m => m.type === "warn");
export const selectDebug = (state: RootState) => state.message.messages.filter(m => m.type === "debug");

export default messageSlice.reducer;
