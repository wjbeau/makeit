import { Grid } from '@material-ui/core';
import React from 'react';
import TitledSection from '../layout/TitledSection';
import TransactionsList from './TransactionList';
import TransactionEdit from './TransactionEdit';

export const FinancePage = () => {
  return (
    <Grid container direction="row" spacing={5}>
      <Grid item xs={12}>
        <TitledSection title="Add Income / Expense">
          <TransactionEdit />
        </TitledSection>
      </Grid>
      <Grid item xs={12}>
        <TitledSection title="Income / Expense Log">
          <TransactionsList />
        </TitledSection>
      </Grid>
    </Grid>
  );
}

export default FinancePage;
