import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useHistory } from 'react-router-dom';
import { Button, Grid, Typography, makeStyles, Container } from '@material-ui/core';
import { Error, Replay } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  layoutGrid: {
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    textAlign: 'center',
  },
  errorIcon: {
    color: 'red',
    height: '5rem',
    width: '5rem',
  },
  errorDetail: {
      padding: theme.spacing(2)
  }
}));

function ErrorFallback({ error, resetErrorBoundary }) {
  const classes = useStyles();
  return (
    <Container>
      <Grid container direction="column" className={classes.layoutGrid}>
        <Grid item className={classes.content}>
          <Error className={classes.errorIcon} />
          <Typography variant="body1">
            Oops! Something went wrong. Please try again or contact us if the
            problem persists.
          </Typography>
          <pre className={classes.errorDetail}>{error.message}</pre>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Replay />}
            onClick={resetErrorBoundary}
          >
            Retry
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export const ErrorGuard = (props) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={props.retry}>
      {props.children}
    </ErrorBoundary>
  );
};
