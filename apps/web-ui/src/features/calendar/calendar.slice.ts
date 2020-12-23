import { Event } from '@makeit/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../app/api-client';
import { RootState } from '../../app/store';
import { EventQueryCriteria, EventsState } from './calendar.state';
import * as moment from 'moment';

const initialState: EventsState = {
  events: [],
  loading: false
};

const toQueryParamDate = (date: Date) => {
  return moment.default(date).format('YYYY-MM-DD')
}

export const fetchEvents = createAsyncThunk('calendar/fetchEvents', async (crits: EventQueryCriteria, thunkAPI) => {
  const result = await apiClient().get(`/events?from=${toQueryParamDate(crits.from)}&to=${toQueryParamDate(crits.to)}`);
  thunkAPI.dispatch(receiveEvents(result.data))
  return result.data;
})

export const saveEvent = createAsyncThunk('calendar/saveEvent', async (event: Event, thunkAPI) => {
  if(event._id) {
    const result = await apiClient().put('/events/' + event._id, event);
    thunkAPI.dispatch(eventSaved(result.data))
    return result.data;
  }
  else {
    const result = await apiClient().post('/events', event);
    thunkAPI.dispatch(eventSaved(result.data))
    return result.data;
  }
})

export const eventContact = createAsyncThunk('calendar/deleteEvent', async (event: Event, thunkAPI) => {
  const result = await apiClient().delete('/events/' + event._id);
  if(result.data) {
    thunkAPI.dispatch(eventDeleted(event))
  }
  return result.data;
})


export const calendarReducer = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    receiveEvents: (state, action) => {
      state.loading = false;
      state.events = action.payload
    },
    eventSaved: (state, action) => {
      state.loading = false;
      const idx = state.events.findIndex(a => a._id === action.payload._id)
      if(idx < 0) {
        state.events.push(action.payload)
      }
      else {
        state.events.splice(idx, 1, action.payload)
      }
    },
    eventDeleted: (state, action) => {
      state.loading = false;
      const idx = state.events.findIndex(a => a._id === action.payload._id)
      if(idx >=  0) {
        state.events.splice(idx, 1)
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEvents.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.events = [];
        state.loading = false;
      })
      .addCase(saveEvent.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(saveEvent.rejected, (state, action) => {
        state.loading = false;
      })
  }
});

export const { receiveEvents, eventSaved, eventDeleted } = calendarReducer.actions;

export const selectEvents = (state: RootState) => state.calendar.events;
export const selectEventsLoading = (state: RootState) => state.calendar.loading;

export default calendarReducer.reducer;
