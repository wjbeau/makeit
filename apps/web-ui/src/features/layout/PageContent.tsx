/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from 'react';
import { Routes } from '../../app/Routes';
import { SidebarMenu } from './SidebarMenu';
import { AuthedRoute } from '../auth/AuthedRoute';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container, Grid } from '@material-ui/core';
import { IfAuthenticated } from '../auth/IfAuthenticated';
import { DIMENSIONS } from './dimensions';
import { Loading } from './Loading';
import SupportButton from '../support/SupportButton';

const useStyles = makeStyles((theme) => ({
  grid: {
    minHeight: DIMENSIONS.pageContentHeight,
    flexWrap: 'nowrap',
  },
  container: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  sidebarLeft: {
    flexGrow: 0,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
    [theme.breakpoints.only('sm')]: {
      width: theme.spacing(8),
    },
    [theme.breakpoints.up('md')]: {
      width: DIMENSIONS.drawerWidth,
      marginRight: theme.spacing(8),
    },
  },
  sidebarRight: {
    flexGrow: 0,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
    [theme.breakpoints.only('sm')]: {
      width: theme.spacing(8),
    },
    [theme.breakpoints.up('md')]: {
      width: DIMENSIONS.drawerWidth,
      marginLeft: theme.spacing(8),
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export function PageContent() {
  const classes = useStyles();
  return (
    <Router>
      <Container maxWidth="xl" className={classes.container}>
        <Grid container direction="row" className={classes.grid}>
          <IfAuthenticated>
            <Grid item className={classes.sidebarLeft}>
              <SidebarMenu />
            </Grid>
          </IfAuthenticated>
          <Grid item className={classes.content}>
            <Suspense fallback={<Loading />}>
              <Switch>
                {[
                  Routes.routeDefinitions.public,
                  Routes.routeDefinitions.career,
                ].map((set: any) =>
                  set.routes.map((route: any) =>
                    route.requiresAuth ? (
                      <AuthedRoute
                        key={route.path}
                        path={route.path}
                        exact={route.exact}
                        children={<route.main />}
                      />
                    ) : (
                      <Route
                        key={route.path}
                        path={route.path}
                        exact={route.exact}
                        children={<route.main />}
                      />
                    )
                  )
                )}
              </Switch>
            </Suspense>
          </Grid>
          <IfAuthenticated>
            <Grid item className={classes.sidebarRight}></Grid>
          </IfAuthenticated>
        </Grid>
      </Container>
      <IfAuthenticated>
        <SupportButton />
      </IfAuthenticated>
    </Router>
  );
}
