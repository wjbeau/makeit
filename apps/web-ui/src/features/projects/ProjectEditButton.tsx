import { IconButton, makeStyles } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProjectEditButton = (props: { id: any }) => {
  const { id } = props;
  const history = useHistory();

  const goToEdit = () => {
    history.push('/projects/' + id + '/edit');
  };
  return (
    <IconButton aria-label="edit" onClick={goToEdit}>
      <Edit />
    </IconButton>
  );
};

export default ProjectEditButton;
