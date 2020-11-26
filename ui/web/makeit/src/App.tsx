import React from 'react';
import { Header } from './features/layout/Header';
import { Footer } from './features/layout/Footer';
import { PageContent } from './features/layout/PageContent';
import './App.scss';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';


const theme = createMuiTheme({
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <PageContent />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
