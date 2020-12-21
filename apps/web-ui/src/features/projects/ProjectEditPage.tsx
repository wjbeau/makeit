import DateFnsUtils from '@date-io/moment';
import {
  ModelFactory, Project, ProjectStatus
} from '@makeit/types';
import {
  Breadcrumbs,
  Button,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import { ArrowBack, CancelOutlined, SaveAltOutlined } from '@material-ui/icons';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch } from '../../app/store';
import Loading from '../layout/Loading';
import { logError, logSuccess } from '../logging/logging.slice';
import {
  saveProject,
  selectProjects,
  selectProjectsLoading
} from './project.slice';
import ProjectDetailsEdit from './ProjectDetailsEdit';
import ProjectEventsEdit from './ProjectEventsEdit';

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

const ProjectEditPage = () => {
  const classes = useStyles();
  const { projectId } = useParams<{ projectId: string }>();
  const [formValues, setFormValues] = useState<Project>(
    ModelFactory.createEmptyProject(ProjectStatus.Active)
  );
  const loading = useSelector(selectProjectsLoading);
  const Projects = useSelector(selectProjects);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleSave = (values) => {
    dispatch(saveProject(values))
      .then(unwrapResult)
      .then((p) => {
        history.push('/projects');
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

  const title = projectId === 'new' ? 'New Project' : 'Edit Project';

  const validationSchema = yup.object().shape({
    name: yup.string().required('Required'),
    status: yup.string().required('Required'),
    events: yup.array(
      yup.object({
        time: yup.date().transform((curr, orig) => {
          return !orig || !orig.isValid || !orig.isValid() ? undefined : curr
        }).required('Required'),
        eventType: yup.string().required('Required')
      }),
    ),
  });

  useEffect(() => {
    if (projectId !== 'new') {
      setFormValues(Projects.find((a) => a._id === projectId));
    }
  }, [projectId, setFormValues, formValues, Projects]);

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
                        Back to Projects
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
                    <ProjectDetailsEdit formikPrefix={null} project={values} />
                  </Grid>
                  <Grid item>
                    <ProjectEventsEdit project={values} />
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

export default ProjectEditPage;
