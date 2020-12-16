import { Contact } from '@makeit/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../app/api-client';
import { RootState } from '../../app/store';
import { ContactsState } from './contact.state';

const initialState: ContactsState = {
  contacts: [],
  loading: false
};

export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async (userId: string, thunkAPI) => {
  const result = await apiClient().get('/contacts');
  thunkAPI.dispatch(receiveContacts(result.data))
})

export const fetchContact = createAsyncThunk('contacts/fetchContact', async (contactId: string, thunkAPI) => {
  const result = await apiClient().get('/contacts/' + contactId);
  thunkAPI.dispatch(receiveContact(result.data))
})

export const saveContact = createAsyncThunk('contacts/saveContact', async (contact: Contact, thunkAPI) => {
  if(contact._id) {
    const result = await apiClient().put('/contacts/' + contact._id, contact);
    thunkAPI.dispatch(contactSaved(result.data))
    return result.data;
  }
  else {
    const result = await apiClient().post('/contacts', contact);
    thunkAPI.dispatch(contactSaved(result.data))
    return result.data;
  }
})

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    receiveContacts: (state, action) => {
      state.loading = false;
      state.contacts = action.payload
    },
    receiveContact: (state, action) => {
      state.loading = false;
      const idx = state.contacts.findIndex(a => a._id === action.payload._id)
      if(idx < 0) {
        state.contacts.push(action.payload)
      }
      else {
        state.contacts.splice(idx, 1, action.payload)
      }
    },
    contactSaved: (state, action) => {
      state.loading = false;
      const idx = state.contacts.findIndex(a => a._id === action.payload._id)
      if(idx < 0) {
        state.contacts.push(action.payload)
      }
      else {
        state.contacts.splice(idx, 1, action.payload)
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchContacts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.contacts = [];
        state.loading = false;
      })
      .addCase(fetchContact.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchContact.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(saveContact.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(saveContact.rejected, (state, action) => {
        state.loading = false;
      })
  }
});

export const { receiveContact, receiveContacts, contactSaved } = contactsSlice.actions;

export const selectContacts = (state: RootState) => state.contacts.contacts;
export const selectContactsLoading = (state: RootState) => state.contacts.loading;

export default contactsSlice.reducer;
