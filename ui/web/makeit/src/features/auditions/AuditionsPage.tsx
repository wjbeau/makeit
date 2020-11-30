import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { selectAuthed } from '../auth/auth.slice';
import { logError } from '../logging/logging.slice';
import { fetchAuditions, selectAuditionsLoading, selectAuditions } from './audition.slice';
import { AuditionsList } from './AuditionsList';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import IfNotLoading from '../layout/IfNotLoading';
import TitledSection from '../layout/TitledSection';
import AuditionCard from './AuditionCard';
import { Audition } from './audition.state';
import { AddBoxOutlined } from '@material-ui/icons';

const PREVIEW_COUNT = 3;

const useStyles = makeStyles((theme) => ({
  noContent: {
    justifyContent: "center"
  },
}));

export const AuditionsPage = () => {
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectAuditionsLoading)
  const auditions = useSelector(selectAuditions)
  const dispatch = useAppDispatch();
  const history = useHistory();
  const futureAuditions: Audition[] = auditions.slice(0, PREVIEW_COUNT); //TODO filter only future meetings and sort by date 
  const pastAuditions: Audition[] = []; //TODO filter only future meetings and sort by date desc
  const classes = useStyles();

  const handleAdd = () => {
    history.push("auditions/new/edit")
  }

  useEffect(() => {
    dispatch(fetchAuditions(user?.userId ?? "notnull"))
      .then(unwrapResult)
      .catch(error => dispatch(logError(error)))
  }, [dispatch, user?.userId])

  return (
    <Grid container direction="column" spacing={5}>
      <Grid item>
        <Button variant="contained" color="primary" onClick={handleAdd}
          startIcon={<AddBoxOutlined />}>
          New Audition
        </Button>
      </Grid>
      <Grid container direction="row" spacing={3}>
        <Grid item xs={6}>
          <TitledSection variant="h6" component="h2" title="Upcoming Auditions">
            <IfNotLoading loading={loading}>
              <Grid container direction="column" spacing={2}>
                {futureAuditions.length > 0 &&
                  futureAuditions.map(m => <Grid item key={m.id}><AuditionCard audition={m} /></Grid>)
                }
                {futureAuditions.length === 0 &&
                  <Grid item className={classes.noContent}>
                    <Typography variant="body2">No upcoming meetings to show</Typography>
                  </Grid>
                }
              </Grid>
            </IfNotLoading>
          </TitledSection>
        </Grid>
        <Grid item xs={6}>
          <TitledSection variant="h6" component="h2" title="Recent Auditions">
            <IfNotLoading loading={loading}>
              <Grid container direction="column" spacing={2}>
                {pastAuditions.length > 0 &&
                  pastAuditions.map(m => <Grid item key={m.id}><AuditionCard audition={m} /></Grid>)
                }
                {pastAuditions.length === 0 &&
                  <Grid item className={classes.noContent}>
                    <Typography variant="body2">No recent meetings to show</Typography>
                  </Grid>
                }
              </Grid>
            </IfNotLoading>
          </TitledSection>
        </Grid>
      </Grid>
      <Grid item>
        <TitledSection variant="h6" component="h2" title="Audition Log">
          <IfNotLoading loading={loading}>
            <AuditionsList auditions={auditions} />
          </IfNotLoading>
        </TitledSection>
      </Grid>
    </Grid>
  );
}

export default AuditionsPage;
