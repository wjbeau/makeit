import React, { Suspense } from 'react';
import { routeDefinitions } from "../../app/Routes";
import { SidebarMenu } from "./SidebarMenu";
import { AuthedRoute } from "../auth/AuthedRoute";
import { makeStyles } from '@material-ui/core/styles';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { Container, Grid } from '@material-ui/core';
import { IfAuthenticated } from '../auth/IfAuthenticated';
import { DIMENSIONS } from './dimensions';
import { Loading } from './Loading';

const useStyles = makeStyles((theme) => ({
    grid: {
        minHeight: DIMENSIONS.pageContentHeight
    },
    sidebar: {
        flexGrow: 0,
        width: DIMENSIONS.drawerWidth
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
                    <Container maxWidth="lg">
                        <Suspense fallback={<Loading />}>
                            <Switch>
                                {[routeDefinitions.public, routeDefinitions.career].map((set: any) =>
                                    set.routes.map((route: any) =>
                                        route.requiresAuth ?
                                            <AuthedRoute key={route.path}
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
                                    )
                                )
                                }
                            </Switch>
                        </Suspense>
                    </Container>
                </Grid>
                <IfAuthenticated>
                    <Grid item className={classes.sidebar}>

                    </Grid>
                </IfAuthenticated>
            </Grid>
        </Router>
    );
}
