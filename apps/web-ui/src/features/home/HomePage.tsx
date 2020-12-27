import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import RecentAuditions from '../auditions/RecentAuditions';
import UpcomingAuditions from '../auditions/UpcomingAuditions';
import TitledSection from '../layout/TitledSection';
import ActiveProjects from '../projects/ActiveProjects';

export const HomePage = () => {
  return (
    <Grid container direction="row" spacing={5}>
      <Grid item lg={8} xs={12}>
        <Grid container direction="column" style={{display: 'table'}}>
          <Grid item xs={12}>
            <ActiveProjects />
          </Grid>
          <Grid item xs={12}>
            <UpcomingAuditions preview={3} hideIfEmpty={true} />
          </Grid>
          <Grid item xs={12}>
            <RecentAuditions preview={3} hideIfEmpty={true}  />
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={4} xs={12}>
        <Grid container direction="column">
          <TitledSection variant="h6" component="h2" title="Statistics">
            <Typography variant="body2">
              This will show statistics about the public profile (number of
              views, number of plays of reel, etc) and stats on auditions
              (booking %, etc.)
            </Typography>
          </TitledSection>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;
