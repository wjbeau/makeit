import React from 'react';
import { Routes } from "../../app/Routes";
import { SidebarMenu } from "./SidebarMenu";
import { AuthedRoute } from "../auth/AuthedRoute";
import { makeStyles } from '@material-ui/core/styles';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { Drawer } from '@material-ui/core';
import { IfAuthenticated } from '../auth/IfAuthenticated';
import { Dimensions } from './dimensions';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: Dimensions.headerHeight,
        paddingBottom: Dimensions.footerHeight,

        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: Dimensions.drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: Dimensions.drawerWidth,
        height: Dimensions.pageContentHeight,
        top: Dimensions.headerHeight,
        bottom: Dimensions.footerHeight
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        height: Dimensions.pageContentHeight,
        marginLeft: Dimensions.drawerWidth,
    },
}));


export function PageContent() {
    const classes = useStyles();
    return (
        <Router>
            <div className={classes.root}>
                <IfAuthenticated>
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}>
                        <SidebarMenu />
                    </Drawer>
                </IfAuthenticated>
                <main className={classes.content}>
                    <Switch>
                        {Routes.map((route) => (
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
                </main>
            </div>
        </Router>
    );
}
