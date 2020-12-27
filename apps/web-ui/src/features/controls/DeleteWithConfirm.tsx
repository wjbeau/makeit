/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button, makeStyles, Tooltip, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import { Address } from '@makeit/types';
import { Delete } from '@material-ui/icons';

export const useStyles = makeStyles((theme) => ({
    delete: {
      color: theme.palette.error.dark
    },
    deleteMenu: {
      marginTop: theme.spacing(4)
    },
    menuIcon: {
      marginRight: theme.spacing(2),
    },
}));

export const DeleteWithConfirm = (props: { onDelete: () => void }) => {
  const { onDelete } = props;
  const classes = useStyles();
  const [deleteAnchor, setDeleteAnchor] = useState(null);

  const handleShowDelete = (evt) => {
    setDeleteAnchor(evt.currentTarget);
  };

  const handleDelete = () => {
      onDelete();
      setDeleteAnchor(null);
  };

  return (
  <>
    <IconButton onClick={handleShowDelete}>
      <Delete />
    </IconButton>
    <Menu
      anchorEl={deleteAnchor}
      keepMounted
      open={!!deleteAnchor}
      onClose={() => setDeleteAnchor(null)}
      className={classes.deleteMenu}
    >
      <MenuItem onClick={handleDelete} className={classes.delete}>
        <Delete className={classes.menuIcon} /> Delete
      </MenuItem>
    </Menu>
  </>);
};

export default DeleteWithConfirm;
