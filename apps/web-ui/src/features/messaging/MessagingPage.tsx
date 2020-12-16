import { Grid } from '@material-ui/core';
import React from 'react';
import TitledSection from '../layout/TitledSection';

export const MessagingPage = () => {
  return (
    <Grid container direction="column" spacing={5}>
      <Grid item>
        <TitledSection title="Messaging">
          Content TODO
        </TitledSection>
      </Grid>
    </Grid>
  );
}

export default MessagingPage;
