import { Grid } from '@material-ui/core';
import React from 'react';
import RecentAuditions from '../auditions/RecentAuditions';
import UpcomingAuditions from '../auditions/UpcomingAuditions';
import ActiveProjects from '../projects/ActiveProjects';

export const HomePage = () => {
  return (
    <Grid container direction="row" spacing={5}>
      <Grid item xs={8}>
        <ActiveProjects />
      </Grid>
      <Grid item xs={4}>
        <Grid container direction="column" spacing={3}>
          <Grid item xs={12}>
            <UpcomingAuditions preview={3} />
          </Grid>
          <Grid item xs={12}>
            <RecentAuditions preview={3} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default HomePage;
