import React from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { unwrapResult } from '@reduxjs/toolkit';
import { loginAttempt, selectLoading } from "./auth.slice";
import {
  useHistory
} from "react-router-dom";
import { Button, Grid, Link, makeStyles, Paper, Typography } from '@material-ui/core';
import { logError } from '../logging/logging.slice';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '../forms/TextInput';

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthResponse } from '@makeit/types';

const useStyles = makeStyles((theme) => ({
  loginForm: {
    justifyContent: "center"
  },
  loginBackground: {
    justifyContent: "center",
    minHeight: "30vh",
    padding: 50
  },
  buttonBlock: {
    width: "100%"
  }
}));

const validationSchema = yup.object().shape({
  username: yup.string().required("Required"),
  password: yup.string().required("Required")
});

export const LoginPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { handleSubmit, errors } = methods;

  const handleLogin = (data: AuthResponse) => {
    dispatch(loginAttempt(data))
      .then(unwrapResult)
      .then(auth => {
        history.push("/")
      })
      .catch(error => dispatch(logError(error)))
  }
  const loading = useSelector(selectLoading);

  return (
    <div>
      {!loading &&

        <Grid container spacing={0} justify="center" direction="row">
          <Grid item>
            <Grid container direction="column" justify="center" spacing={2} className={classes.loginForm}>
              <Paper variant="elevation" elevation={2} className={classes.loginBackground}>
                <Grid item>
                  <Typography component="h1" variant="h5">
                    Log in
                  </Typography>
                </Grid>
                <Grid item>
                  <FormProvider {...methods}>
                    <form>
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <TextInput name="username" label="Username"
                            required={true}
                            errors={errors} />
                        </Grid>
                        <Grid item>
                          <TextInput name="password" label="Password" type="password"
                            required={true}
                            errors={errors} />
                        </Grid>
                        <Grid item>
                          <Button variant="contained" color="primary" className={classes.buttonBlock} onClick={handleSubmit(handleLogin)}>
                            Sign In
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </FormProvider>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    Forgot Password?
                  </Link>
                </Grid>
              </Paper>
            </Grid >
          </Grid >
        </Grid >
      }
      { loading && <div>Loading...</div>}
    </div >
  );
}

export default LoginPage;
