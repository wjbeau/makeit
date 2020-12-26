import { Grid } from '@material-ui/core';
import React from 'react';
import TitledSection from '../layout/TitledSection';
import ExpenseEdit from './ExpenseEdit';
import IncomeEdit from './IncomeEdit';
import TransactionsList from './TransactionList';

export const FinancePage = () => {
  return (
    <Grid container direction="row" spacing={5}>
      <Grid item xs={12} sm={6}>
        <TitledSection title="Add Income">
          <IncomeEdit />
        </TitledSection>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TitledSection title="Add Expenses">
          <ExpenseEdit />
        </TitledSection>
      </Grid>
      <Grid item xs={12}>
        <TitledSection title="Transaction Log">
          <TransactionsList />
        </TitledSection>
      </Grid>
    </Grid>
  );
}

export default FinancePage;
