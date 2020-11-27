import React from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { unwrapResult } from '@reduxjs/toolkit';
import { loginAttempt, selectLoading } from "./auth.slice";
import {
  useHistory
} from "react-router-dom";
import { Button, Grid, Link, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { logError } from '../message/message.slice';

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

export const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    dispatch(loginAttempt({ username: "will", password: "test" })) //TODO pass in user details here
      .then(unwrapResult)
      .then(auth => {
        history.push("/")
      })
      .catch(error => dispatch(logError(error)))
  }
  const loading = useSelector(selectLoading);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

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
                  <form onSubmit={handleLogin}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <TextField type="email" placeholder="Email" fullWidth name="username" variant="outlined"
                          value={username} onChange={(event) => setUsername(event.target.value)}
                          required autoFocus />
                      </Grid>
                      <Grid item>
                        <TextField type="password" placeholder="Password" fullWidth name="password" variant="outlined"
                          value={password} onChange={(event) => setPassword(event.target.value)}
                          required />
                      </Grid>
                      <Grid item>
                        <Button variant="contained" color="primary" type="submit" className={classes.buttonBlock}>
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
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

export default Login;
