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
import { ConfirmProvider } from 'material-ui-confirm';

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

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: '4px 16px',
      },
    },
  },
  palette: {
    secondary: {
      light: '#64d8cb',
      dark: '#00766c',
      main: '#26a69a',
      contrastText: '#eeeeee',
    },
    primary: {
      light: '#757de8',
      dark: '#002984',
      main: '#3f51b5',
      contrastText: '#eeeeee',
    },
  },
});

function App() {
  const classes = useStyles();

  const retry = () => {
    window.location.href = '/';
  };

  return (
    <ThemeProvider theme={theme}>
      <MessagePanel />
      <ErrorGuard retry={retry}>
        <ConfirmProvider>
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
        </ConfirmProvider>
      </ErrorGuard>
    </ThemeProvider>
  );
}

export default App;
