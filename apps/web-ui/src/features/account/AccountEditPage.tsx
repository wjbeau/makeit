import {
  Avatar,
  Button,
  Grid,
  makeStyles,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
} from '@material-ui/core';
import { AddAPhoto, CancelOutlined, SaveAltOutlined } from '@material-ui/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { UserAccount } from '../../../../../libs/types/src/user.model';
import { useAppDispatch } from '../../app/store';
import Loading from '../layout/Loading';
import { logError, logSuccess } from '../logging/logging.slice';
import AvatarEdit from '../controls/AvatarEdit';
import {
  saveAccount,
  selectCurrentUser,
  selectUserActivityBusy,
} from './user.slice';
import EditableAvatar from '../controls/EditableAvatar';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
  },
  addNoteContainer: {
    marginTop: theme.spacing(3),
  },
  settingsContainer: {
    flexWrap: 'nowrap'
  },
  unsaved: {
    color: theme.palette.grey[400],
    marginLeft: theme.spacing(1),
  },
  floatButtons: {
    textAlign: 'right',
  },
  paddingLeft: {
    marginLeft: theme.spacing(1),
  },
}));

const AccountEditPage = () => {
  const classes = useStyles();
  const busy = useSelector(selectUserActivityBusy);
  const currentUser = useSelector(selectCurrentUser);
  const [formValues, setFormValues] = useState<UserAccount>(currentUser);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  };

  const handleSave = (values) => {
    dispatch(saveAccount(values))
      .then(unwrapResult)
      .then((p) => {
        dispatch(logSuccess({ message: 'Save completed successfully.' }));
      })
      .catch((e) => {
        setFormValues(values);
        dispatch(logError(e));
      });
  };

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    email: yup.string().email().required('Required'),
  });

  return (
    <Container maxWidth="sm">
      {busy && <Loading />}
      {!busy && (
        <Formik
          initialValues={formValues}
          onSubmit={handleSave}
          enableReinitialize={true}
          validationSchema={validationSchema}
        >
          {({ dirty, values, submitForm, isSubmitting, resetForm, setFieldValue }) => (
            <Form>
              <Grid container direction="column" spacing={3} className={classes.mainContainer}>
                <Grid item>
                  <Typography variant="h4" component="h1" display="inline">
                    Account Settings
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container direction="row" spacing={3} className={classes.settingsContainer}>
                    <Grid item >
                      <EditableAvatar person={values} onChange={(p) => setFieldValue("avatar", p)} />
                    </Grid>
                    <Grid item>
                      <Field
                        component={TextField}
                        name="email"
                        label="Email"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="firstName"
                        label="First Name"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="lastName"
                        label="Last Name"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Button variant="text" color="primary">
                    Change Password
                  </Button>
                </Grid>
                <Grid item className={classes.floatButtons}>
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
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default AccountEditPage;
