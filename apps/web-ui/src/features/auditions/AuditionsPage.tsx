import { Audition } from '@makeit/types';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { AddBoxOutlined } from '@material-ui/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Converter } from '../../app/Converters';
import { useAppDispatch } from '../../app/store';
import { selectAuthed } from '../auth/auth.slice';
import IfNotLoading from '../layout/IfNotLoading';
import TitledSection from '../layout/TitledSection';
import { logError } from '../logging/logging.slice';
import {
  fetchAuditions,
  selectAuditions,
  selectAuditionsLoading,
} from './audition.slice';
import { AuditionsList } from './AuditionsList';
import RecentAuditions from './RecentAuditions';
import UpcomingAuditions from './UpcomingAuditions';

const PREVIEW_COUNT = 3;

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

export const AuditionsPage = () => {
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectAuditionsLoading);
  const auditionsRaw = useSelector(selectAuditions);
  const auditions = auditionsRaw.map((a) => Converter.convertAllDates(a));
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleAdd = () => {
    history.push('auditions/new/edit');
  };

  useEffect(() => {
    if (!auditions.length && !loading) {
      dispatch(fetchAuditions(user?.userId ?? 'notnull'))
        .then(unwrapResult)
        .catch((error) => dispatch(logError(error)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <UpcomingAuditions preview={3} />
        </Grid>
        <Grid item xs={6}>
          <RecentAuditions preview={3} />
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
