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
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import Loading from '../layout/Loading';
import { logError } from '../logging/logging.slice';
import {
  fetchEvents,
  selectEvents,
  selectEventsLoading
} from './calendar.slice';
import AuditionCard from '../auditions/AuditionCard';
import ProjectCard from '../projects/ProjectCard';
import EventCard from './EventCard';
import { fetchAudition } from '../auditions/audition.slice';
import { useAsync } from '../../app/hooks';
import { fetchProject } from '../projects/project.slice';

const useStyles = makeStyles((theme) => ({
}));

export const EventPanel = (props: {event, onClose: () => void}) => {
  const classes = useStyles();
  const {event, onClose} = props
  const [resource, setResource] = useState(null);
  const dispatch = useAppDispatch();
  
  let doDispatch = () => { return new Promise(resolve => resolve(resource)) };
  let card = <EventCard event={event} expand={true} onClose={onClose}/>;
  switch(event.extendedProps.eventType) {
    case EventType.Audition:
    case EventType.Reminder:
      doDispatch = () => { return dispatch(fetchAudition(event.extendedProps.sourceId));}
      card = <AuditionCard audition={resource} expand={true} onClose={onClose}/>;
      break;
    case EventType.ProjectMeeting:
      doDispatch = () => { return dispatch(fetchProject(event.extendedProps.sourceId));}
      card = <ProjectCard project={resource} expand={true} onClose={onClose} />;
      break;
  }

  useEffect(() => {
    doDispatch()
      .then(unwrapResult)
      .then((data) => {
        setResource(data);
      })
      .catch((error) => dispatch(logError(error)));
    return () => { setResource(null) };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);


  return resource ? card : null;
};

export default EventPanel;
