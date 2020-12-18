import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import TitledSection from '../layout/TitledSection';
import FullCalendar from 'fullcalendar-reactwrapper';

export const CalendarPage = () => {
  return (
    <Grid container direction="column" spacing={5}>
      <Grid item>
        <Typography component="span">
          <FullCalendar
            id="event-calendar"
            header={{
              left: 'prev,next today',
              center: 'title',
              right: 'month, basicWeek, basicDay',
            }}
            navLinks={true} // can click day/week names to navigate views
            editable={true}
            eventLimit={true} // allow "more" link when too many events
            events={[]}
          />
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CalendarPage;
