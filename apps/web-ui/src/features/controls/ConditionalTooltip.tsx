/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Address } from '@makeit/types';

export const useStyles = makeStyles((theme) => ({
  root: {},
  label: {},
}));

export const ConditionalTooltip = (props: {
  title: string;
  children?;
}) => {
  const { title, children } = props;
  const classes = useStyles();

  if(title && title.trim().length > 0) {
    return <Tooltip title={title}>
      {children}
    </Tooltip>
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
};

export default ConditionalTooltip;
