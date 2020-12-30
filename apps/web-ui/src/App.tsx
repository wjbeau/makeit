import {
  createMuiTheme,
  Grid,
  makeStyles,
  Portal,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core';
import { ConfirmProvider } from 'material-ui-confirm';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.scss';
import { DIMENSIONS } from './features/layout/dimensions';
import { Footer } from './features/layout/Footer';
import { Header } from './features/layout/Header';
import { PageContent } from './features/layout/PageContent';
import { ErrorGuard } from './features/logging/ErrorGuard';
import MessagePanel from './features/logging/MessagePanel';

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

let theme = createMuiTheme({
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
theme = responsiveFontSizes(theme, { factor: 3 });

function App() {
  const classes = useStyles();

  const retry = () => {
    window.location.href = '/';
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ErrorGuard retry={retry}>
          <ConfirmProvider>
            <MessagePanel />
            <Grid container direction="column" className={classes.layoutGrid}>
              <Grid item className={classes.header}>
                <Header />
              </Grid>
              <Grid item className={classes.content}>
                <PageContent />
                <Footer />
              </Grid>
            </Grid>
          </ConfirmProvider>
        </ErrorGuard>
      </Router>
    </ThemeProvider>
  );
}

export default App;
