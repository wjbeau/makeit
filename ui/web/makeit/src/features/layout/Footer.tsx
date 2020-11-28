import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { DIMENSIONS } from './dimensions';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.grey[600],
    color: theme.palette.grey[400],
    fontSize: theme.typography.caption.fontSize,
    textAlign: "left",
    padding: "0 1rem",
    height: DIMENSIONS.footerHeight,
  }
}));

export function Footer() {
  const classes = useStyles();
  return (
      <Grid container spacing={0} justify="flex-start" direction="row" className={classes.footer} alignContent="center">
        <Grid item>
          <Typography>2020 William J Beaumont. All rights reserved.
          </Typography>
        </Grid>
      </Grid>
  );
}
