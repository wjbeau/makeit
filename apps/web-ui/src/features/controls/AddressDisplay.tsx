/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { Address } from '@makeit/types';

export const useStyles = makeStyles((theme) => ({
  root: {},
  label: {},
}));

const prefixIfNotNull = (line: string) => {
  if (line) {
    return ', ' + line;
  }
  return '';
};

export const AddressDisplay = (props: {
  address: Address;
  variant: any;
  singleLine?: boolean;
  className?;
}) => {
  const { address, variant, singleLine, className } = props;
  const classes = useStyles();

  let cityLine = '';
  if (address.city) {
    cityLine = address.city;
  }
  let stateLine = '';
  if (address.state) {
    stateLine = address.state;
  }
  if (address.zip) {
    if (stateLine.length) {
      stateLine += ' ';
    }
    stateLine += address.zip;
  }
  if (cityLine.length) {
    cityLine += ', ';
  }
  cityLine += stateLine;

  return (
    <div className={className}>
      {!singleLine && (
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
      )}
      {singleLine && address.line1 && (
        <Typography variant={variant} className={classes.label}>
          {address.line1 +
            prefixIfNotNull(address.line2) +
            prefixIfNotNull(address.line3) +
            prefixIfNotNull(cityLine)}
        </Typography>
      )}
    </div>
  );
};

export default AddressDisplay;
