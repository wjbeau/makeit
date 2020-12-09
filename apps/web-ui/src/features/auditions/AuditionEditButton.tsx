import {
  IconButton,

  makeStyles
} from '@material-ui/core';
import {
  Edit
} from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';

const useStyles = makeStyles((theme) => ({}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuditionEditButton = (props: { id: any }) => {
  const { id } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const goToEdit = () => {
    history.push('/auditions/' + id + '/edit');
  };
  return (
    <IconButton aria-label="edit" onClick={goToEdit}>
      <Edit />
    </IconButton>
  );
};

export default AuditionEditButton;
