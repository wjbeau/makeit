import { AuthRequest } from '@makeit/types';
import {
  Button,
  FormControlLabel,
  Grid,
  Link,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import { Field, Form, Formik } from 'formik';
import { Checkbox, TextField } from 'formik-material-ui';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch } from '../../app/store';
import { logError } from '../logging/logging.slice';
import { loginAttempt, selectLoading } from './auth.slice';
import { FormControl, InputLabel } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  loginForm: {
    justifyContent: 'center',
  },
  loginBackground: {
    justifyContent: 'center',
    minHeight: '30vh',
    padding: 50,
  },
  buttonBlock: {
    width: '100%',
  },
}));

const validationSchema = yup.object().shape({
  username: yup.string().required('Required'),
  password: yup.string().required('Required'),
});

export const LoginPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleLogin = (data: AuthRequest) => {
    dispatch(loginAttempt(data))
      .then(unwrapResult)
      .then((auth) => {
        if (location && location.state && location.state['from']) {
          let dest = location.state['from'];

          //we don't allow jumping straight to an edit page because of load sequence issues
          if (dest.pathname && dest.pathname.indexOf('edit') >= 0) {
            const parts = dest.pathname.split('/');
            dest = parts[0] + '/' + parts[1];
          }

          history.push(dest);
        } else {
          history.push('/');
        }
      })
      .catch((error) =>
        dispatch(
          logError({
            message:
              'Login failed.  Please check your username/password and try again.',
            detail: error,
          })
        )
      );
  };
  const loading = useSelector(selectLoading);

  return (
    <div>
      {!loading && (
        <Grid container spacing={0} justify="center" direction="row">
          <Grid item>
            <Grid
              container
              direction="column"
              justify="center"
              spacing={2}
              className={classes.loginForm}
            >
              <Paper
                variant="elevation"
                elevation={2}
                className={classes.loginBackground}
              >
                <Grid item>
                  <Typography component="h1" variant="h5">
                    Log in
                  </Typography>
                </Grid>
                <Grid item>
                  <Formik
                    initialValues={{
                      username: '',
                      password: '',
                      rememberMe: false,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                  >
                    {({ errors, touched, submitForm, isSubmitting }) => (
                      <Form>
                        <Grid container direction="column" spacing={2}>
                          <Grid item>
                            <Field
                              component={TextField}
                              name="username"
                              label="Username"
                              error={errors.username && touched.username}
                              helperText={errors.username}
                            />
                          </Grid>
                          <Grid item>
                            <Field
                              component={TextField}
                              name="password"
                              label="Password"
                              type="password"
                              error={errors.password && touched.password}
                              helperText={errors.password}
                            />
                          </Grid>
                          <Grid item>
                            <FormControlLabel
                              control={
                                <Field
                                  type="checkbox"
                                  component={Checkbox}
                                  name="rememberMe"
                                  label="Remember Me"
                                />
                              }
                              label="Remember Me"
                            />
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.buttonBlock}
                              onClick={submitForm}
                              disabled={isSubmitting}
                            >
                              Sign In
                            </Button>
                          </Grid>
                        </Grid>
                      </Form>
                    )}
                  </Formik>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    Forgot Password?
                  </Link>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      )}
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default LoginPage;
