import DateFnsUtils from '@date-io/moment';
import { Event } from '@makeit/types';
import {
  Button,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import { CancelOutlined, SaveAltOutlined } from '@material-ui/icons';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { unwrapResult } from '@reduxjs/toolkit';
import { FastField, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { KeyboardDateTimePicker } from 'formik-material-ui-pickers';
import React, { useState } from 'react';
import * as yup from 'yup';
import { useAppDispatch } from '../../app/store';
import { logError, logSuccess } from '../logging/logging.slice';
import { saveEvent } from './calendar.slice';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    position: 'relative',
  },
  addNoteContainer: {
    marginTop: theme.spacing(3),
  },
  unsaved: {
    color: theme.palette.grey[400],
    marginLeft: theme.spacing(1),
  },
  floatButtons: {
    float: 'right',
  },
  paddingLeft: {
    marginLeft: theme.spacing(1),
  },
}));

const EventDetailsEdit = (props: {
  event: Event;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const { event, onSave, onCancel } = props;
  const classes = useStyles();
  const [formValues, setFormValues] = useState<Event>(event);
  const dispatch = useAppDispatch();

  const handleSave = (values, {setSubmitting, setErrors, setStatus, resetForm}) => {
    dispatch(saveEvent(values))
      .then(unwrapResult)
      .then((p) => {
        setSubmitting(false);
        resetForm(p)
        setStatus({success: true})
        onSave();
        dispatch(logSuccess({ message: 'Save completed successfully.' }));
      })
      .catch((e) => {
        setSubmitting(false);
        setFormValues(values);
        dispatch(logError(e));
      });
  };
  const handleCancel = () => {
    onCancel();
  };

  const title = !event._id ? 'New Event' : 'Edit ' + event.title;

  const validationSchema = yup.object().shape({
    title: yup.string().required('Required'),
    start: yup
      .date()
      .transform((curr, orig) => {
        return !orig || !orig.isValid || !orig.isValid() ? undefined : curr;
      })
      .required('Required'),
    end: yup
      .date()
      .transform((curr, orig) => {
        return !orig || !orig.isValid || !orig.isValid() ? undefined : curr;
      })
      .required('Required'),
  });

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Formik
        initialValues={formValues}
        onSubmit={handleSave}
        enableReinitialize={true}
        validationSchema={validationSchema}
      >
        {({ dirty, values, submitForm, isSubmitting }) => (
          <Form>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Typography variant="h6" component="h6" display="inline">
                  {title}
                </Typography>
                {dirty && (
                  <Typography
                    variant="h6"
                    component="p"
                    className={classes.unsaved}
                    display="inline"
                  >
                    (Unsaved)
                  </Typography>
                )}
                </Grid>
              <Grid item>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12}>
                    <FastField
                      component={TextField}
                      name="title"
                      label="Title"
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FastField
                      component={TextField}
                      name="description"
                      label="Description"
                      multiline
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FastField
                      component={KeyboardDateTimePicker}
                      format="MM/DD/YYYY hh:mm a"
                      name="start"
                      label="From"
                      fullWidth={true}
                      initialFocusedDate={null}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FastField
                      component={KeyboardDateTimePicker}
                      format="MM/DD/YYYY hh:mm a"
                      name="end"
                      label="To"
                      fullWidth={true}
                      initialFocusedDate={null}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FastField
                      component={TextField}
                      name="location.line1"
                      label="Address Line 1"
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FastField
                      component={TextField}
                      name="location.line2"
                      label="Line 2"
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FastField
                          component={TextField}
                          name="location.city"
                          label="City"
                          fullWidth={true}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FastField
                          component={TextField}
                          name="location.state"
                          label="State"
                          fullWidth={true}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FastField
                          component={TextField}
                          name="location.zip"
                          label="Zip"
                          fullWidth={true}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<SaveAltOutlined />}
                  disabled={isSubmitting || !dirty}
                  onClick={submitForm}
                >
                  Save
                </Button>
                <Button
                  variant="text"
                  color="default"
                  onClick={handleCancel}
                  startIcon={<CancelOutlined />}
                  className={classes.paddingLeft}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </MuiPickersUtilsProvider>
  );
};

export default EventDetailsEdit;
