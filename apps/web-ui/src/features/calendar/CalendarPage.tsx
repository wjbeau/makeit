import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Event, EventType } from '@makeit/types';
import {
  Box,
  Button,
  Card,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import Loading from '../layout/Loading';
import { logError } from '../logging/logging.slice';
import {
  fetchEvents,
  selectEvents,
  selectEventsLoading,
} from './calendar.slice';
import EventPanel from './EventPanel';
import { CancelOutlined } from '@material-ui/icons';
import { DIMENSIONS } from '../layout/dimensions';

const LOADING_INDICATOR_DELAY = 300;

const useStyles = makeStyles((theme) => ({
  calendar: {
    position: 'relative',
    flexGrow: 1,
  },
  eventView: {
    flexGrow: 0,
    position: 'absolute',
    right: 0,
    background: 'white',
    zIndex: 2,
    [theme.breakpoints.down('xs')]: {
      left: 0,
      right: 0,
      top: DIMENSIONS.headerHeight - theme.spacing(1),
      position: 'fixed'
    },
    [theme.breakpoints.up('sm')]: {
      top: 92,
      maxWidth: 450,
    },
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
    extendedProps: {
      sourceId: e.sourceId,
      type: e.eventType,
    },
    ...e,
    ...colorsFor(e.eventType, theme),
  };
};

export const CalendarPage = () => {
  const loading = useSelector(selectEventsLoading);
  const loadedEvents = useSelector(selectEvents);
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const calendarRef = React.createRef<FullCalendar>();
  const theme = useTheme();
  const [activeEvent, setActiveEvent] = useState(null);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [timeoutHandle, setTimeoutHandle] = useState(null);


  useEffect(() => {
    if(loading) {
      const handle = setTimeout(
        () => setShowLoading(loading),
        LOADING_INDICATOR_DELAY
      ); //don't show the loading screen unless there is an actual delay
      setTimeoutHandle(handle);
    }
    else {
      setShowLoading(false);
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
        setTimeoutHandle(null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

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

  const handleEventClick = (evtInfo) => {
    setActiveEvent(evtInfo.event);
  };

  const handleCloseEvent = () => {
    setActiveEvent(null);
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container direction="row" spacing={5}>
      <Grid item className={classes.calendar}>
        <Typography component="span">
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
            eventClick={handleEventClick}
          />
          {showLoading && (
            <div className={classes.loadingOverlay}>
              <Card className={classes.loadingInner}>
                <Loading />
              </Card>
            </div>
          )}
        </Typography>
        {activeEvent && (
          <Paper elevation={3} className={classes.eventView}>
            <EventPanel
              event={activeEvent}
              onClose={handleCloseEvent}
            />
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default CalendarPage;
