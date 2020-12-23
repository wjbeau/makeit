import {
  Button,


  makeStyles
} from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    right: -66,
    top: 'calc(50% - 10px)',
    transform: 'rotate(-90deg)',
    zIndex: 1200
  },
  menuIcon: {
    marginRight: theme.spacing(2),
  },
}));

export const SupportButton = () => {
  const classes = useStyles();

  return (
    <Button
      variant="contained"
      color="secondary"
      className={classes.root}
    >
      Provide Feedback
    </Button>
  );
};

export default SupportButton;
