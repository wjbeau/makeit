import { AuthRequest } from '@makeit/types';
import {
  Button,
  Divider,
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
import { AddCircle, CheckBox } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  loginForm: {
    justifyContent: 'center',
    maxWidth: 625,
  },
  loginBackground: {
    justifyContent: 'center',
    padding: 50,
    height: 375
  },
  buttonBlock: {
    width: '100%',
  },
  pageContent: {
    height: '100%',
    alignItems: 'center',
  },
  signupButton: {
    textAlign: 'center',
    marginTop: theme.spacing(6),
  },
  textCenter: {
    textAlign: 'center'
  },
  explainer: {
    textAlign: 'justify',
    marginTop: theme.spacing(2)
  },
  forgot: {
    marginTop: theme.spacing(1),
    textAlign: 'center'
  }
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

  const handleRegister = () => {
    history.push("/register")
  }

  const loading = useSelector(selectLoading);

  return (
    <>
      {!loading && (
        <Grid
          container
          spacing={0}
          justify="center"
          direction="row"
          className={classes.pageContent}
        >
          <Grid>
            <Grid
              container
              direction="column"
              justify="center"
              spacing={2}
              className={classes.loginForm}
            >
              <Grid item>
                <Grid container spacing={5} justify="center" direction="row">
                  <Grid item xs={12} sm={6}>
                    <Paper
                      variant="elevation"
                      elevation={2}
                      className={classes.loginBackground}
                    >
                      <Typography component="h1" variant="h5">
                        Log in
                      </Typography>
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
                      <div className={classes.forgot}>
                        <Link href="#" variant="body2">
                          Forgot Password?
                        </Link>
                      </div>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      variant="elevation"
                      elevation={1}
                      className={classes.loginBackground}
                    >
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <Typography component="h2" variant="h6" className={classes.textCenter}>
                            No account yet?
                          </Typography>
                          <Typography color="textSecondary" variant="body1" className={classes.explainer}>
                            Not to worry, registering is a simple process. Why
                            not give it a shot and see whether Make It is right
                            for your Acting career?
                          </Typography>
                          <div className={classes.signupButton}>
                            <Button
                              variant="contained"
                              color="secondary"
                              startIcon={<CheckBox />}
                              onClick={handleRegister}
                            >
                              Register
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      {loading && <div>Loading...</div>}
    </>
  );
};

export default LoginPage;
