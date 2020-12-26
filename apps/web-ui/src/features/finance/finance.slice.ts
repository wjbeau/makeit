import { Transaction } from '@makeit/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../app/api-client';
import { RootState } from '../../app/store';
import { FinanceState } from './finance.state';

const initialState: FinanceState = {
  transactions: [],
  loading: false
};

export const fetchTransactions = createAsyncThunk('finance/fetchTransactions', async (userId: string, thunkAPI) => {
  const result = await apiClient().get('/transactions');
  thunkAPI.dispatch(receiveTransactions(result.data))
  return result.data
})

export const fetchTransaction = createAsyncThunk('finance/fetchTransaction', async (id: string, thunkAPI) => {
  const result = await apiClient().get('/transactions/' + id);
  thunkAPI.dispatch(receiveTransaction(result.data))
  return result.data
})

export const saveTransaction = createAsyncThunk('finance/saveTransaction', async (transaction: Transaction, thunkAPI) => {
  if(transaction._id) {
    const result = await apiClient().put('/transactions/' + transaction._id, transaction);
    thunkAPI.dispatch(transactionSaved(result.data))
    return result.data;
  }
  else {
    const result = await apiClient().post('/transactions', transaction);
    thunkAPI.dispatch(transactionSaved(result.data))
    return result.data;
  }
})

export const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    receiveTransactions: (state, action) => {
      state.loading = false;
      state.transactions = action.payload
      state.transactions.sort((a,b) => a.date.toString().localeCompare(b.date.toString()));
    },
    receiveTransaction: (state, action) => {
      state.loading = false;
      const idx = state.transactions.findIndex(a => a._id === action.payload._id)
      if(idx < 0) {
        state.transactions.push(action.payload)
      }
      else {
        state.transactions.splice(idx, 1, action.payload)
      }
      state.transactions.sort((a,b) => a.date.toString().localeCompare(b.date.toString()));
    },
    transactionSaved: (state, action) => {
      state.loading = false;
      const idx = state.transactions.findIndex(a => a._id === action.payload._id)
      if(idx < 0) {
        state.transactions.push(action.payload)
      }
      else {
        state.transactions.splice(idx, 1, action.payload)
      }
      state.transactions.sort((a,b) => a.date.toString().localeCompare(b.date.toString()));
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTransactions.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactions = [];
        state.loading = false;
      })
      .addCase(fetchTransaction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(saveTransaction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(saveTransaction.rejected, (state, action) => {
        state.loading = false;
      })
  }
});

export const { receiveTransactions, receiveTransaction, transactionSaved } = financeSlice.actions;

export const selectTransactions = (state: RootState) => state.finance.transactions;
export const selectTransactionsLoading = (state: RootState) => state.finance.loading;

export default financeSlice.reducer;
