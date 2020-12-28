/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from 'react';
import { Routes } from '../../app/Routes';
import { SidebarMenu } from './SidebarMenu';
import { AuthedRoute } from '../auth/AuthedRoute';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container, Divider, Drawer, Grid, Hidden, IconButton, useMediaQuery } from '@material-ui/core';
import { IfAuthenticated } from '../auth/IfAuthenticated';
import { DIMENSIONS } from './dimensions';
import { Loading } from './Loading';
import SupportButton from '../support/SupportButton';
import { ChevronLeft } from '@material-ui/icons';
import { useAppDispatch } from '../../app/store';
import { useSelector } from 'react-redux';
import { selectDrawerOpen, setDrawerOpen } from './layout.slice';
import clsx from 'clsx';
import { selectAuthed } from '../auth/auth.slice';

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
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentAdjustLeft: {
    marginLeft: -DIMENSIONS.drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  drawer: {
    width: DIMENSIONS.drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: DIMENSIONS.drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

export function PageContent() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const open = useSelector(selectDrawerOpen);
  const authed = useSelector(selectAuthed);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));

  const handleDrawerOpen = () => {
    dispatch(setDrawerOpen(true));
  };

  const handleDrawerClose = () => {
    dispatch(setDrawerOpen(false));
  };

  return (
    <Router>
      <Container maxWidth="xl" className={classes.container}>
        <Grid container direction="row" className={classes.grid}>
          <IfAuthenticated>
            <Hidden xsDown>
              <Grid item className={classes.sidebarLeft}>
                <SidebarMenu />
              </Grid>
            </Hidden>
            <Hidden smUp>
              <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                <div className={classes.drawerHeader}>
                  <IconButton onClick={handleDrawerClose}>
                    <ChevronLeft />
                  </IconButton>
                </div>
                <Divider />
                <SidebarMenu />
              </Drawer>
            </Hidden>
          </IfAuthenticated>
          <Grid item 
            className={clsx(classes.content, {
              [classes.contentShift]: open && authed,
              [classes.contentAdjustLeft]: isXs
            })}>
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
