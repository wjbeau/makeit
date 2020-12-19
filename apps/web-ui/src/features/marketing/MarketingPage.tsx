import { Grid } from '@material-ui/core';
import React from 'react';
import TitledSection from '../layout/TitledSection';

export const MarketingPage = () => {
  return (
    <Grid container direction="column" spacing={5}>
      <Grid item>
        <TitledSection title="Marketing">
          Content TODO
        </TitledSection>
      </Grid>
    </Grid>
  );
}

export default MarketingPage;
