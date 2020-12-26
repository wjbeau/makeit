import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Event, EventType, ModelFactory } from '@makeit/types';
import {
  Box,
  Button,
  Card,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
  useTheme
} from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import { useConfirm } from 'material-ui-confirm';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { DIMENSIONS } from '../layout/dimensions';
import Loading from '../layout/Loading';
import { logError } from '../logging/logging.slice';
import {
  fetchEvents,
  selectEvents,
  selectEventsLoading
} from './calendar.slice';
import EventDetailsEdit from './EventDetailsEdit';
import EventPanel from './EventPanel';
import * as moment from 'moment';

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
      position: 'fixed',
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

const addHour = (date: Date) => {
  return moment.default(date).add(1, 'hour').toDate()
}

const augmentEvent = (e: Event, theme: Theme) => {
  return {
    start: new Date(e.start),
    end: new Date(e.end),
    title: e.title,
    extendedProps: {
      original: e
    },
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
  const [editEvent, setEditEvent] = useState(null);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [timeoutHandle, setTimeoutHandle] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const confirmPrompt = useConfirm();

  useEffect(() => {
    if (loading) {
      const handle = setTimeout(
        () => setShowLoading(loading),
        LOADING_INDICATOR_DELAY
      ); //don't show the loading screen unless there is an actual delay
      setTimeoutHandle(handle);
    } else {
      setShowLoading(false);
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
        setTimeoutHandle(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const events = loadedEvents.map((e) => augmentEvent(e, theme));

  const loadEvents = () => {
    if (!loading && start && end) {
      dispatch(
        fetchEvents({
          from: start,
          to: end,
        })
      )
        .then(unwrapResult)
        .catch((error) => dispatch(logError(error)));
    }
  };

  const handleEventClick = (evtInfo) => {
    if (editEvent) {
      confirmPrompt({
        description: 'Your unsaved changes will be lost.  Continue?',
      }).then(() => {
        setActiveEvent(evtInfo.event.extendedProps?.original);
        setEditEvent(null);
      }).catch(() => { /* ignore */ });
    } else {
      setActiveEvent(evtInfo.event.extendedProps?.original);
      setEditEvent(null);
    }
  };

  const handleEditClick = () => {
    setEditEvent(activeEvent);
    setActiveEvent(null);
  };

  const handleCloseEvent = () => {
    setActiveEvent(null);
    setEditEvent(null);
  };

  //if we haven't had a date range set deduce it from the calendar
  useEffect(() => {
    if (calendarRef && calendarRef.current && (!start || !end)) {
      const currentView = calendarRef.current.getApi().view;
      setStart(currentView.activeStart);
      setEnd(currentView.activeEnd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarRef]);

  //if the date range changes, reload the events
  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  return (
    <Grid container direction="row" spacing={5}>
      <Grid item className={classes.calendar}>
        <Typography component="span">
          <div>
            <Button
              onClick={() => {
                setEditEvent(ModelFactory.createEmptyEvent(new Date(), addHour(new Date())));
                setActiveEvent(null);
              }}
            >
              New Event
            </Button>
          </div>
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
              setStart(dateInfo.start);
              setEnd(dateInfo.end);
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
        {(activeEvent || editEvent) && (
          <Paper elevation={3} className={classes.eventView}>
            {activeEvent && (
              <EventPanel
                event={activeEvent}
                onClose={handleCloseEvent}
                onEdit={handleEditClick}
              />
            )}
            {editEvent && (
              <Box padding={3}>
                <EventDetailsEdit
                  event={editEvent}
                  onSave={handleCloseEvent}
                  onCancel={handleCloseEvent}
                />
              </Box>
            )}
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default CalendarPage;
