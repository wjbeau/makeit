/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  label: {
    verticalAlign: 'middle',
    display: 'inline-flex',
    marginRight: theme.spacing(1),
    width: '18ch',
  },
  children: {
    top: '-2px',
    position: 'relative',
  },
}));

export const TextWithAction = (props: {
  label: string;
  icon: any;
  href: string;
  children: any;
}) => {
  const { label, icon, href, children } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {label && (
        <Typography
          display="inline"
          variant="subtitle1"
          className={classes.label}
        >
          <span className={classes.icon}>{icon}</span> {label}
        </Typography>
      )}
      {children && (
        <Typography
          display="inline"
          variant="body2"
          className={classes.children}
        >
          {children}
        </Typography>
      )}
    </div>
  );
};

export default TextWithAction;
