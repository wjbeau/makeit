/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  passive: {
    borderLeft: '5px solid transparent',
  },
  active: {
    color: theme.palette.primary.dark,
    borderLeft: '5px solid ' + theme.palette.primary.dark,
  },
  disabled: {
    color: theme.palette.grey[400],
    borderLeft: '5px solid transparent',
  },
}));

const RouteItem = (props: any) => {
  const { route, classes, showLabels } = props;
  if (route.disabled) {
    return (
      <Tooltip title={route.description}>
        <ListItem button className={classes.disabled}>
          <ListItemIcon>{route.icon}</ListItemIcon>
          {showLabels && <ListItemText primary={route.title} />}
        </ListItem>
      </Tooltip>
    );
  }

  return (
    <ListItem
      button
      component={NavLink}
      to={route.path}
      activeClassName={classes.active}
      exact={route.exact}
      className={classes.passive}
    >
      {!showLabels && (
        <Tooltip title={route.title}>
          <ListItemIcon>{route.icon}</ListItemIcon>
        </Tooltip>
      )}
      {showLabels && (
        <>
          <ListItemIcon>{route.icon}</ListItemIcon>
          <ListItemText primary={route.title} />
        </>
      )}
    </ListItem>
  );
};

export function SidebarMenuSection(props: any) {
  const classes = useStyles();
  const theme = useTheme();
  const showLabels = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <>
      {props.section.title && <Divider />}
      {showLabels && props.section.title && (
        <ListSubheader>{props.section.title}</ListSubheader>
      )}
      {props.section.routes
        .filter((route: any) => route.showInMenu)
        .filter((route) => props.showDisabled || !route.disabled)
        .map((route: any, index) => (
          <RouteItem
            route={route}
            classes={classes}
            key={index}
            showLabels={showLabels}
          />
        ))}
    </>
  );
}
