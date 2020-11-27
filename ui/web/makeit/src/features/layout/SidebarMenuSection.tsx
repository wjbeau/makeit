import React from 'react';
import {
  NavLink
} from "react-router-dom";
import { Divider, ListItem, ListItemIcon, ListItemText, ListSubheader, makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  passive: {
    borderLeft: "5px solid transparent"
  },
  active: {
    color: theme.palette.primary.dark,
    borderLeft: "5px solid " + theme.palette.primary.dark
  }
}));

export function SidebarMenuSection(props: any) {
  const classes = useStyles();
  return (
    <>
      {props.section.title && <Divider />}
      {props.section.title && <ListSubheader>{props.section.title}</ListSubheader>}
      {props.section.routes.filter((route:any) => route.showInMenu).map((route:any) => (
        <ListItem button key={route.path} component={NavLink} to={route.path} activeClassName={classes.active} exact={route.exact} className={classes.passive}>
          <ListItemIcon>{route.icon}</ListItemIcon>
          <ListItemText primary={route.title} />
        </ListItem>
      ))}
    </>
  );
}
