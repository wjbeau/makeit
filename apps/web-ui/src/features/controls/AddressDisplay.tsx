/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { Address } from '@makeit/types';

export const useStyles = makeStyles((theme) => ({
  root: {},
  label: {},
}));

export const AddressDisplay = (props: { address: Address; variant: any }) => {
  const { address, variant } = props;
  const classes = useStyles();

  let cityLine = ''
  if(address.city) {
      cityLine = address.city
  }
  let stateLine = ''
  if(address.state) {
      stateLine = address.state 
  }
  if(address.zip) {
      if(stateLine.length) {
          stateLine += ' '
      }
      stateLine += address.zip
  }
  if(cityLine.length) {
      cityLine += ', '
  }
  cityLine += stateLine

  return (
    <div className={classes.root}>
      {address.line1 && (
        <Typography variant={variant} className={classes.label}>
          {address.line1}
        </Typography>
      )}
      {address.line2 && (
        <Typography variant={variant} className={classes.label}>
          {address.line2}
        </Typography>
      )}
      {address.line3 && (
        <Typography variant={variant} className={classes.label}>
          {address.line3}
        </Typography>
      )}
      {cityLine && cityLine.length > 0 && (
        <Typography variant={variant} className={classes.label}>
          {cityLine}
        </Typography>
      )}
    </div>
  );
};

export default AddressDisplay;
