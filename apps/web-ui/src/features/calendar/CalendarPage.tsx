import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Card, Grid, makeStyles, Typography } from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import Loading from '../layout/Loading';
import { logError } from '../logging/logging.slice';
import {
  fetchEvents,
  selectEvents,
  selectEventsLoading,
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
    zIndex: 2
  },
  loadingInner: {
    padding: theme.spacing(2),
    background: theme.palette.background.default
  }
}));

export const CalendarPage = () => {
  const loading = useSelector(selectEventsLoading);
  const events = useSelector(selectEvents);
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const calendarRef = React.createRef()

  const loadEvents = () => {
    if (!loading && calendarRef && calendarRef.current) {
      const currentView = calendarRef.current.getApi().view
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
              start: 'prev,next today',
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
