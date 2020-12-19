import React from 'react';
import { Header } from './features/layout/Header';
import { Footer } from './features/layout/Footer';
import { PageContent } from './features/layout/PageContent';
import './App.scss';
import {
  createMuiTheme,
  Grid,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core';
import { DIMENSIONS } from './features/layout/dimensions';
import MessagePanel from './features/logging/MessagePanel';
import { ErrorGuard } from './features/logging/ErrorGuard';
import { useHistory } from 'react-router-dom';
import SupportButton from './features/support/SupportButton';

const useStyles = makeStyles((theme) => ({
  layoutGrid: {
    minHeight: '100vh',
  },
  header: {
    flexGrow: 0,
    height: DIMENSIONS.headerHeight,
  },
  content: {
    flexGrow: 1,
    minHeight: DIMENSIONS.pageContentHeight,
  },
}));

const theme = createMuiTheme({});

function App() {
  const classes = useStyles();

  const retry = () => {
    window.location.href = '/';
  };

  return (
    <ThemeProvider theme={theme}>
      <MessagePanel />
      <ErrorGuard retry={retry}>
        <Grid container direction="column" className={classes.layoutGrid}>
          <Grid item className={classes.header}>
            <Header />
          </Grid>
          <Grid item className={classes.content}>
            <PageContent />
            <SupportButton />
            <Footer />
          </Grid>
        </Grid>
      </ErrorGuard>
    </ThemeProvider>
  );
}

export default App;
