import { Audition } from '@makeit/types';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Converter } from '../../app/Converters';
import IfNotLoading from '../layout/IfNotLoading';
import TitledSection from '../layout/TitledSection';
import {
  fetchAuditions,
  selectAuditions,
  selectAuditionsLoading,
} from './audition.slice';
import AuditionCard from './AuditionCard';
import { useAppDispatch } from '../../app/store';
import { unwrapResult } from '@reduxjs/toolkit';
import { logError } from '../logging/logging.slice';
import { selectAuthed } from '../auth/auth.slice';
import NothingToShow from '../layout/NothingToShow';

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

export const RecentAuditions = (props: { preview: number, hideIfEmpty?:boolean }) => {
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectAuditionsLoading);
  const auditionsRaw = useSelector(selectAuditions);
  const auditions = auditionsRaw.map((a) => Converter.convertAllDates(a));
  const pastAuditions: Audition[] = auditions
    .filter((a) => !isFuture([a.deadline, a.auditionTime]))
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
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {(!props.hideIfEmpty || loading || pastAuditions.length > 0) && (
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
                  <NothingToShow message="No recent auditions..." />
                </Grid>
              )}
            </Grid>
          </IfNotLoading>
        </TitledSection>
      )}
    </>
  );
};

export default RecentAuditions;
