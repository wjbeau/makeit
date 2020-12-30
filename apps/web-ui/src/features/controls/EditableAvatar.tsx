import { PersonInfo } from '@makeit/types';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import { AddAPhoto } from '@material-ui/icons';
import React, { useState } from 'react';
import AvatarEdit from './AvatarEdit';

const MAX_FILE_SIZE = 500000;

const useStyles = makeStyles((theme) => ({
  mainAvatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginRight: theme.spacing(2),
  },
  avatarContainer: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginRight: theme.spacing(2),
    position: 'relative',
  },
  addIcon: {
    position: 'absolute',
    top: theme.spacing(3),
    left: -theme.spacing(3),
    background: theme.palette.grey[500],
    border: '1px solid white',

    '&:hover': {
        background: theme.palette.grey[300],
    }
  }
}));

export const EditableAvatar = (props: {
  person: PersonInfo;
  onChange: (preview) => void;
}) => {
  const { person, onChange } = props;
  const classes = useStyles();

  const [avatarDialogOpen, setAvatarDialogOpen] = useState<boolean>(false);

  const handleAvatarDialogClose = () => {
    setAvatarDialogOpen(false);
  };
  const handleAvatarClick = () => {
    setAvatarDialogOpen(true);
  };
  return (
    <>
      <div className={classes.avatarContainer}>
        <Avatar src={person.avatar} className={classes.mainAvatar} />
        <IconButton onClick={handleAvatarClick} className={classes.addIcon}>
          <AddAPhoto />
        </IconButton>
      </div>
      <Dialog
        onClose={handleAvatarDialogClose}
        aria-labelledby="avatar-edit-title"
        open={avatarDialogOpen}
      >
        <DialogTitle id="avatar-edit-title">Change Your Picture</DialogTitle>
        <DialogContent dividers>
          <AvatarEdit person={person} onChange={onChange} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleAvatarDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditableAvatar;
