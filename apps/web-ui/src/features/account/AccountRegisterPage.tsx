import {
  Button,
  Container, Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import {
  CancelOutlined,
  SaveAltOutlined
} from '@material-ui/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { UserAccount , ModelFactory} from '@makeit/types';
import { useAppDispatch } from '../../app/store';
import EditableAvatar from '../controls/EditableAvatar';
import Loading from '../layout/Loading';
import { logError, logSuccess } from '../logging/logging.slice';
import PasswordInputWithStrength from './PasswordInputWithStrength';
import { registerAccount, selectUserActivityBusy } from './user.slice';

const useStyles = makeStyles((theme) => ({
  mainContainer: {},
  addNoteContainer: {
    marginTop: theme.spacing(3),
  },
  settingsContainer: {
    flexWrap: 'nowrap',
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

const AccountRegisterPage = () => {
  const classes = useStyles();
  const busy = useSelector(selectUserActivityBusy);
  const [formValues, setFormValues] = useState<UserAccount>(ModelFactory.createEmptyUserAccount());
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleCancel = () => {
    history.push("/login");
  };

  const handleSave = (values) => {
    dispatch(registerAccount(values))
      .then(unwrapResult)
      .then((p) => {
        dispatch(logSuccess({ message: 'Account created successfully. Please log in with your new credentials!' }));
        history.push("/login")
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
    password: yup.string().required('Required'),
    confirmpwd: yup
      .string()
      .required('Required')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
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
          {({
            dirty,
            values,
            submitForm,
            isSubmitting,
            resetForm,
            setFieldValue,
          }) => (
            <Form>
              <Grid
                container
                direction="column"
                spacing={3}
                className={classes.mainContainer}
              >
                <Grid item>
                  <Typography variant="h4" component="h1" display="inline">
                    Register a New Account
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={3}
                    className={classes.settingsContainer}
                  >
                    <Grid item>
                      <EditableAvatar
                        person={values}
                        onChange={(p) => setFieldValue('avatar', p)}
                      />
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
                      <Field
                        component={PasswordInputWithStrength}
                        name="password"
                        label="Password"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="confirmpwd"
                        label="Confirm Password"
                        fullWidth
                        type="password"
                      />
                    </Grid>
                  </Grid>
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

export default AccountRegisterPage;
