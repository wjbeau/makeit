import React from 'react';
import { Routes } from "../../app/Routes";
import {
    Switch,
    Route,
    NavLink 
  } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText, SvgIcon } from "@material-ui/core"

export function SidebarMenu() {
  return (
    <nav>
        <List>
            {Routes.filter(route => route.showInMenu).map((route) => (
                <ListItem button key={route.path} component={NavLink} to={route.path}>
                    <ListItemIcon><SvgIcon>{route.icon}</SvgIcon></ListItemIcon>
                    <ListItemText primary={route.title} />
                </ListItem>
            ))}
        </List>
        <Switch>
            {Routes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                />
                ))}
        </Switch>
    </nav>
  );
}
