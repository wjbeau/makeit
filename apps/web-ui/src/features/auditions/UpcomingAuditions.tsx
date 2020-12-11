import { Audition, AuditionStatus } from '@makeit/types';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Converter } from '../../app/Converters';
import { useAppDispatch } from '../../app/store';
import { selectAuthed } from '../auth/auth.slice';
import IfNotLoading from '../layout/IfNotLoading';
import NothingToShow from '../layout/NothingToShow';
import TitledSection from '../layout/TitledSection';
import { logError } from '../logging/logging.slice';
import {
  selectAuditions,
  selectAuditionsLoading,
  fetchAuditions,
} from './audition.slice';
import AuditionCard from './AuditionCard';

const useStyles = makeStyles((theme) => ({
  noContent: {
    justifyContent: 'center',
  },
}));

const isFuture = (dates: Date[]) => {
  const result = dates.find(
    (d) => d && new Date().getTime() - d.getTime() <= 0
  );
  return result;
};

export const UpcomingAuditions = (props: { preview: number }) => {
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectAuditionsLoading);
  const auditionsRaw = useSelector(selectAuditions);
  const auditions = auditionsRaw.map((a) => Converter.convertAllDates(a));
  const futureAuditions: Audition[] = auditions
    .filter(
      (a) =>
        isFuture([a.deadline, a.auditionTime]) &&
        (a.status === AuditionStatus.Accepted ||
          a.status === AuditionStatus.Invited)
    )
    .sort((a, b) => {
      if (a.deadline && b.deadline) return b.deadline - a.deadline;
      if (a.deadline && !b.deadline) return -1;
      if (!a.deadline && b.deadline) return 1;
      return b.auditionTime - a.auditionTime;
    })
    .slice(0, props.preview);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!auditions.length && !loading) {
      dispatch(fetchAuditions(user?.userId ?? 'notnull'))
        .then(unwrapResult)
        .catch((error) => dispatch(logError(error)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
              <NothingToShow message="No upcoming auditions..." />
            </Grid>
          )}
        </Grid>
      </IfNotLoading>
    </TitledSection>
  );
};

export default UpcomingAuditions;
