import { Grid } from '@material-ui/core';
import React from 'react';
import TitledSection from '../layout/TitledSection';

export const CalendarPage = () => {
  return (
    <Grid container direction="column" spacing={5}>
      <Grid item>
        <TitledSection title="Calendar">
          Content TODO
        </TitledSection>
      </Grid>
    </Grid>
  );
}

export default CalendarPage;
