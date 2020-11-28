import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { selectAuthed } from '../auth/auth.slice';
import Loading from '../layout/Loading';
import { logError } from '../message/message.slice';
import { fetchMeetings, selectMeetingsLoading, selectMeetings } from './meetings.slice';
import MeetingsList from './MeetingsList';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import IfNotLoading from '../layout/IfNotLoading';
import TitledSection from '../layout/TitledSection';
import MeetingCard from './MeetingCard';

const PREVIEW_COUNT = 3;

const useStyles = makeStyles((theme) => ({
  noContent: {
    justifyContent: "center"
  },
}));

export const MeetingsPage = () => {
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectMeetingsLoading)
  const meetings = useSelector(selectMeetings)
  const dispatch = useAppDispatch();
  const history = useHistory();
  const futureMeetings = meetings.slice(0, PREVIEW_COUNT); //TODO filter only future meetings and sort by date 
  const pastMeetings:any[] = []; //TODO filter only future meetings and sort by date desc
  const classes = useStyles();
  
  const handleAdd = () => {
    history.push("meetings/new/edit")
  }

  useEffect(() => {
    dispatch(fetchMeetings(user?.userId ?? "notnull"))
      .then(unwrapResult)
      .catch(error => dispatch(logError(error)))
  }, [dispatch, user?.userId])

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          New Meeting
        </Button>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={4}>
            <IfNotLoading loading={loading}>
              <TitledSection variant="h6" component="h2" title="Upcoming Meetings">
                <Grid container direction="column" spacing={2}>
                  { futureMeetings.length > 0 &&
                    futureMeetings.map(m => <Grid item><MeetingCard meeting={m} /></Grid>) 
                  }
                  { futureMeetings.length === 0 &&
                    <Grid item className={classes.noContent}>
                      <Typography variant="body2">No upcoming meetings to show</Typography>
                    </Grid>
                  }
                </Grid>
              </TitledSection>
            </IfNotLoading>
          </Grid>
          <Grid item xs={4}>
            <IfNotLoading loading={loading}>
              <TitledSection variant="h6" component="h2" title="Recent Meetings">
                <Grid container direction="column" spacing={2}>
                  { pastMeetings.length > 0 &&
                    pastMeetings.map(m => <Grid item><MeetingCard meeting={m} /></Grid>)
                  }
                  { pastMeetings.length === 0 &&
                    <Grid item className={classes.noContent}>
                      <Typography variant="body2">No recent meetings to show</Typography>
                    </Grid>
                  }
                </Grid>
              </TitledSection>
            </IfNotLoading>
          </Grid>
        </Grid>
        <Grid item>
          <MeetingsList meetings={meetings} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default MeetingsPage;
