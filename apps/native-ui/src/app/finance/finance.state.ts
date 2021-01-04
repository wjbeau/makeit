// State objects for the auditions feature

import { Transaction } from '@makeit/types';

export interface FinanceState {
    transactions: Transaction[];
    loading: boolean;
}
