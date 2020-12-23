import { IconButton, makeStyles } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EventEditButton = (props: { onClick: () => void }) => {
  const { onClick } = props;

  return (
    <IconButton aria-label="edit" onClick={onClick}>
      <Edit />
    </IconButton>
  );
};

export default EventEditButton;
