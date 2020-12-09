import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { selectAuthed } from '../auth/auth.slice';
import { logError } from '../logging/logging.slice';
import {
  fetchAuditions,
  selectAuditionsLoading,
  selectAuditions,
} from './audition.slice';
import { AuditionsList } from './AuditionsList';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import IfNotLoading from '../layout/IfNotLoading';
import TitledSection from '../layout/TitledSection';
import AuditionCard from './AuditionCard';
import { AddBoxOutlined } from '@material-ui/icons';
import { Audition, AuditionStatus } from '@makeit/types';
import { now } from 'lodash';
import { Converter } from '../../app/Converters';

const PREVIEW_COUNT = 3;

const useStyles = makeStyles((theme) => ({
  noContent: {
    justifyContent: 'center',
  },
}));

const isFuture = (dates: Date[]) => {
  const result = dates.find(d => d && (new Date().getTime() - d.getTime()) <= 0)
  return result;
}

export const AuditionsPage = () => {
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectAuditionsLoading);
  const auditionsRaw = useSelector(selectAuditions);
  const auditions = auditionsRaw.map(a => Converter.convertAllDates(a))
  const dispatch = useAppDispatch();
  const history = useHistory();
  const futureAuditions: Audition[] = auditions
    .filter(a => 
        isFuture([a.deadline, a.auditionTime]) 
        && (a.status === AuditionStatus.Accepted || a.status === AuditionStatus.Invited)
    )
    .sort((a, b) => {
        if(a.deadline && b.deadline) return b.deadline - a.deadline;
        if(a.deadline && !b.deadline) return -1;
        if(!a.deadline && b.deadline) return 1;
        return b.auditionTime - a.auditionTime;
    })
    .slice(0, PREVIEW_COUNT);
  const pastAuditions: Audition[] = auditions
    .filter(a => 
      !isFuture([a.deadline, a.auditionTime]) 
    )
    .slice(0, PREVIEW_COUNT);
  const classes = useStyles();

  const handleAdd = () => {
    history.push('auditions/new/edit');
  };

  useEffect(() => {
    dispatch(fetchAuditions(user?.userId ?? 'notnull'))
      .then(unwrapResult)
      .catch((error) => dispatch(logError(error)));
  }, [dispatch, user?.userId]);

  return (
    <Grid container direction="column" spacing={5}>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          startIcon={<AddBoxOutlined />}
        >
          New Audition
        </Button>
      </Grid>
      <Grid container direction="row" spacing={3}>
        <Grid item xs={6}>
          <TitledSection variant="h6" component="h2" title="Upcoming Auditions">
            <IfNotLoading loading={loading}>
              <Grid container direction="column" spacing={2}>
                {futureAuditions.length > 0 &&
                  futureAuditions.map((m) => (
                    <Grid item key={m._id}>
                      <AuditionCard audition={m} />
                    </Grid>
                  ))}
                {futureAuditions.length === 0 && (
                  <Grid item className={classes.noContent}>
                    <Typography variant="body2">
                      No upcoming meetings to show
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </IfNotLoading>
          </TitledSection>
        </Grid>
        <Grid item xs={6}>
          <TitledSection variant="h6" component="h2" title="Recent Auditions">
            <IfNotLoading loading={loading}>
              <Grid container direction="column" spacing={2}>
                {pastAuditions.length > 0 &&
                  pastAuditions.map((m) => (
                    <Grid item key={m._id}>
                      <AuditionCard audition={m} />
                    </Grid>
                  ))}
                {pastAuditions.length === 0 && (
                  <Grid item className={classes.noContent}>
                    <Typography variant="body2">
                      No recent meetings to show
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </IfNotLoading>
          </TitledSection>
        </Grid>
        <Grid item xs={12}>
          <TitledSection variant="h6" component="h2" title="Audition Log">
            <IfNotLoading loading={loading}>
              <AuditionsList auditions={auditions} />
            </IfNotLoading>
          </TitledSection>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AuditionsPage;
