import React, { Suspense } from 'react';
import { allRoutes } from "../../app/Routes";
import { SidebarMenu } from "./SidebarMenu";
import { AuthedRoute } from "../auth/AuthedRoute";
import { makeStyles } from '@material-ui/core/styles';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { Grid, Paper } from '@material-ui/core';
import { IfAuthenticated } from '../auth/IfAuthenticated';
import { Dimensions } from './dimensions';
import { Loading } from './Loading';

const useStyles = makeStyles((theme) => ({
    grid: {
        minHeight: Dimensions.pageContentHeight
    },
    sidebar: {
        flexGrow: 0,
        width: Dimensions.drawerWidth
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    paper: {
        height: "100%",
        padding: theme.spacing(1)
    }
}));


export function PageContent() {
    const classes = useStyles();
    return (
        <Router>
            <Grid container direction="row" className={classes.grid}>
                <IfAuthenticated>
                    <Grid item className={classes.sidebar}>
                        <SidebarMenu />
                    </Grid>
                </IfAuthenticated>
                <Grid item className={classes.content}>
                    <Paper className={classes.paper}>
                        <Suspense fallback={<Loading />}>
                            <Switch>
                                {allRoutes.map((route) => (
                                    route.requiresAuth ? <AuthedRoute
                                        key={route.path}
                                        path={route.path}
                                        exact={route.exact}
                                        children={<route.main />}
                                    />
                                        : <Route
                                            key={route.path}
                                            path={route.path}
                                            exact={route.exact}
                                            children={<route.main />}
                                        />
                                ))}
                            </Switch>
                        </Suspense>
                    </Paper>
                </Grid>
            </Grid>
        </Router>
    );
}
