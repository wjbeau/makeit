import { Attachment } from '@makeit/types';
import {
  IconButton,
  ListItem,

  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import { AttachFile, Delete, Image, YouTube } from '@material-ui/icons';
import React from 'react';
import { Converter } from '../../app/Converters';
import { AttachmentType } from '../../../../../libs/types/src/attachment.model';
import { SERVER_URL } from '../../app/config';

const MAX_FILE_SIZE = 5000000;

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(1),
  },
}));

export const FileAttachment = (props: {
  attachment: Attachment,
  readOnly?: boolean
}) => {
  const classes = useStyles();
  const { attachment, readOnly } = props
  
  const handleDelete = () => {
    console.log("Not yet implemented");
  }

  const showFile = () => {
    window.open(SERVER_URL + '/files/' + attachment.reference, '_blank')
  }

  let icon = <AttachFile />
  if(props.attachment.mimeType?.startsWith('image/')) {
    icon = <Image />;
  }
  else if(props.attachment.mimeType === 'application/pdf') {
    icon = <Image />;
  }
  if(props.attachment.mimeType?.startsWith('video/')) {
    icon = <YouTube />;
  }

  return (
    <ListItem button onClick={showFile}>
      <ListItemIcon>
        {icon}
        </ListItemIcon>
      <ListItemText 
        primary={attachment.displayName ? attachment.displayName : attachment.fileName} 
        secondary={attachment.attachmentType ? Converter.getLabelForEnum(AttachmentType, attachment.attachmentType) : null} />
      {!readOnly && <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={handleDelete}> 
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>}
    </ListItem>
  );
};

export default FileAttachment;
