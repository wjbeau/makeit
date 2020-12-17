import DateFnsUtils from '@date-io/moment';
import {
  Audition,
  ModelFactory,
  ParticipantReferenceType,
  ParticipantType,
} from '@makeit/types';
import {
  Breadcrumbs,
  Button,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ArrowBack, CancelOutlined, SaveAltOutlined } from '@material-ui/icons';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { unwrapResult } from '@reduxjs/toolkit';
import { FastField, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { KeyboardDateTimePicker } from 'formik-material-ui-pickers';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { selectAuthed } from '../auth/auth.slice';
import Loading from '../layout/Loading';
import TitledPaper from '../layout/TitledPaper';
import { logError, logSuccess } from '../logging/logging.slice';
import {
  saveAudition,
  selectAuditions,
  selectAuditionsLoading,
} from './audition.slice';
import AuditionDetailsEdit from './AuditionDetailsEdit';
import AuditionNotesEdit from './AuditionNotesEdit';
import BreakdownDetailsEdit from './BreakdownDetailsEdit';
import ProjectDetailsEdit from './ProjectDetailsEdit';
import * as yup from 'yup';

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
    marginLeft: theme.spacing(1)
  }
}));

const AuditionEditPage = () => {
  const classes = useStyles();
  const { auditionId } = useParams<{ auditionId: string }>();
  const [formValues, setFormValues] = useState<Audition>(
    ModelFactory.createEmptyAudition()
  );
  const loading = useSelector(selectAuditionsLoading);
  const auditions = useSelector(selectAuditions);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleSave = (values) => {
    dispatch(saveAudition(values))
      .then(unwrapResult)
      .then((p) => {
        history.push('/auditions');
        dispatch(logSuccess({ message: 'Save completed successfully.' }));
      })
      .catch((e) => {
        setFormValues(values);
        dispatch(logError(e));
      });
  };
  const handleCancel = () => {
    history.goBack();
  };

  const title = auditionId === 'new' ? 'New Audition' : 'Edit Audition';

  const validationSchema = yup.object().shape({
    type: yup.string().required('Required'),
    auditionTime: yup.date().required('Required').nullable(),
    status: yup.string().required('Required'),
    breakdown: yup.object({
      roleName: yup.string().required('Required'),
      project: yup.object({
        name: yup.string().required('Required'),
      }),
    }),
  });

  useEffect(() => {
    if (auditionId !== 'new') {
      setFormValues(auditions.find((a) => a._id === auditionId));
    }
  }, [auditionId, setFormValues, formValues, auditions]);

  return (
    <div>
      {loading && <Loading />}
      {!loading && (
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
                    <Breadcrumbs>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={handleCancel}
                        startIcon={<ArrowBack />}
                      >
                        Back to Auditions
                      </Button>
                    </Breadcrumbs>
                  </Grid>
                  <Grid item>
                    <Typography variant="h4" component="h1" display="inline">
                      {title}
                    </Typography>
                    {dirty && (
                      <Typography
                        variant="h5"
                        component="p"
                        className={classes.unsaved}
                        display="inline"
                      >
                        (Unsaved)
                      </Typography>
                    )}
                    {dirty && (
                      <div className={classes.floatButtons}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<SaveAltOutlined />}
                          disabled={isSubmitting}
                          onClick={submitForm}
                        >
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          color="default"
                          onClick={handleCancel}
                          startIcon={<CancelOutlined />}
                          className={classes.paddingLeft}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </Grid>
                  <Grid item>
                    <AuditionDetailsEdit audition={values} />
                  </Grid>
                  <Grid item>
                    <Grid container direction="row" spacing={3}>
                      <Grid item xs={6}>
                        <BreakdownDetailsEdit breakdown={values.breakdown} />
                      </Grid>
                      <Grid item xs={6}>
                        <ProjectDetailsEdit
                          project={values.breakdown.project}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <AuditionNotesEdit formValues={values} />
                  </Grid>
                  <Grid item>
                    <TitledPaper
                      variant="h6"
                      component="h2"
                      title="Set Reminder"
                    >
                      <Grid container direction="row" spacing={2}>
                        <Grid item xs={3}>
                          <FastField
                            component={KeyboardDateTimePicker}
                            name="reminderTime"
                            label="Date / Time"
                            format="MM/DD/YYYY hh:mm a"
                            fullWidth={true}
                            initialFocusedDate={null}
                          />
                        </Grid>
                        <Grid item xs={9}>
                          <FastField
                            component={TextField}
                            name="reminderDescription"
                            label="Description"
                            multiline
                            fullWidth={true}
                          />
                        </Grid>
                      </Grid>
                    </TitledPaper>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={2} direction="row">
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<SaveAltOutlined />}
                          disabled={isSubmitting}
                          onClick={submitForm}
                        >
                          Save
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="default"
                          onClick={handleCancel}
                          startIcon={<CancelOutlined />}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </MuiPickersUtilsProvider>
      )}
    </div>
  );
};

export default AuditionEditPage;
