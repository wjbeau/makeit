import { Link as LinkModel } from '@makeit/types';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { Delete, Link } from '@material-ui/icons';
import React from 'react';

const MAX_FILE_SIZE = 5000000;

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  ellipsis: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

export const LinkAttachment = (props: {
  link: LinkModel;
  readOnly?: boolean;
  onDelete?: () => void;
}) => {
  const classes = useStyles();
  const { link, readOnly, onDelete } = props;

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <ListItem button onClick={() => window.open(link.url, '_blank')}>
      <ListItemIcon>
        <Link />
      </ListItemIcon>
      <ListItemText
        primary={link.display}
        secondary={link.url}
        classes={{ primary: classes.ellipsis, secondary: classes.ellipsis }}
      />
      {!readOnly && (
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default LinkAttachment;
