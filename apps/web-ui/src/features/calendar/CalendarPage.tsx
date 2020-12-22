import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Event, EventType } from '@makeit/types';
import {
  Card,
  Grid,
  makeStyles,
  Theme, Typography,
  useTheme
} from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import Loading from '../layout/Loading';
import { logError } from '../logging/logging.slice';
import {
  fetchEvents,
  selectEvents,
  selectEventsLoading
} from './calendar.slice';

const useStyles = makeStyles((theme) => ({
  calendar: {
    position: 'relative',
  },
  loadingOverlay: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  loadingInner: {
    padding: theme.spacing(2),
    background: theme.palette.background.default,
  },
}));

const colorsFor = (t: EventType, theme: Theme) => {
  switch (t) {
    case EventType.Audition:
      return {
        backgroundColor: theme.palette.error.light,
        borderColor: theme.palette.error.dark,
        textColor: theme.palette.error.contrastText,
      };
    case EventType.ProjectMeeting:
      return {
        backgroundColor: theme.palette.success.light,
        borderColor: theme.palette.success.dark,
        textColor: theme.palette.success.contrastText,
      };
    case EventType.Reminder:
      return {
        backgroundColor: theme.palette.warning.light,
        borderColor: theme.palette.warning.dark,
        textColor: theme.palette.warning.contrastText,
      };
    default:
      return {
        backgroundColor: theme.palette.info.light,
        borderColor: theme.palette.info.dark,
        textColor: theme.palette.info.contrastText,
      };
  }
};

const augmentEvent = (e: Event, theme: Theme) => {
  return {
    start: new Date(e.start),
    end: new Date(e.end),
    ...e,
    ...colorsFor(e.eventType, theme),
  };
};

export const CalendarPage = () => {
  const loading = useSelector(selectEventsLoading);
  const loadedEvents = useSelector(selectEvents);
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const calendarRef = React.createRef();
  const theme = useTheme();

  const events = loadedEvents.map((e) => augmentEvent(e, theme));

  const loadEvents = () => {
    if (!loading && calendarRef && calendarRef.current) {
      const currentView = calendarRef.current.getApi().view;
      dispatch(
        fetchEvents({
          from: currentView.activeStart,
          to: currentView.activeEnd,
        })
      )
        .then(unwrapResult)
        .catch((error) => dispatch(logError(error)));
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container direction="column" spacing={5}>
      <Grid item>
        <Typography component="span" className={classes.calendar}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: 'prev,today,next',
              center: 'title',
              end: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            navLinks={true} // can click day/week names to navigate views
            editable={true}
            allDaySlot={false}
            events={events}
            datesSet={(dateInfo) => {
              loadEvents();
            }}
          />
          {loading && (
            <div className={classes.loadingOverlay}>
              <Card className={classes.loadingInner}>
                <Loading />
              </Card>
            </div>
          )}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CalendarPage;
