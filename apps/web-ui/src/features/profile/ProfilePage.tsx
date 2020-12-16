import { Grid } from '@material-ui/core';
import React from 'react';
import TitledSection from '../layout/TitledSection';

export const ProfilePage = () => {
  return (
    <Grid container direction="column" spacing={5}>
      <Grid item>
        <TitledSection title="Profile">
          Content TODO
        </TitledSection>
      </Grid>
    </Grid>
  );
}

export default ProfilePage;
