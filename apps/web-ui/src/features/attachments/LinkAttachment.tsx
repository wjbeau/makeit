import { Link as LinkModel } from '@makeit/types';
import {
  IconButton,
  ListItem,

  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import { AttachFile, Delete, Image, Link, YouTube } from '@material-ui/icons';
import React from 'react';

const MAX_FILE_SIZE = 5000000;

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(1),
  },
}));

export const LinkAttachment = (props: {
  link: LinkModel,
  readOnly?: boolean
}) => {
  const classes = useStyles();
  const { link, readOnly } = props
  
  const handleDelete = () => {
    console.log("Not yet implemented");
  }

  return (
    <ListItem button onClick={() => console.log("view file: " + link.url)}>
      <ListItemIcon>
        <Link />
      </ListItemIcon>
      <ListItemText primary={link.display} secondary={link.type} />
      {!readOnly && <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={handleDelete}> 
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>}
    </ListItem>
  );
};

export default LinkAttachment;
