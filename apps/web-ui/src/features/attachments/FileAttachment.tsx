import { Attachment } from '@makeit/types';
import {
  IconButton,
  ListItem,

  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import { AttachFile, Delete, Image, YouTube, PictureAsPdf } from '@material-ui/icons';
import React from 'react';
import { Converter } from '../../app/Converters';
import { AttachmentType } from '../../../../../libs/types/src/attachment.model';
import { SERVER_URL } from '../../app/config';
import { useAppDispatch } from '../../app/store';
import { unwrapResult } from '@reduxjs/toolkit';
import { logError } from '../logging/logging.slice';
import { downloadFile } from '../files/files.slice';

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
    overflow: 'hidden'
  }
}));

export const FileAttachment = (props: {
  attachment: Attachment,
  readOnly?: boolean,
  onDelete?: () => void
}) => {
  const classes = useStyles();
  const { attachment, readOnly, onDelete } = props
  const dispatch = useAppDispatch();
  
  const handleDelete = () => {
    if(onDelete) {
      onDelete();
    }
  }

  const showFile = () => {
    dispatch(downloadFile(attachment.reference))
      .then(unwrapResult)
      .then(blob => {
        //TODO I guess we might want to treat different file types differently here?
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 150);
      })
      .catch(error => dispatch(logError(error)))
  }

  let icon = <AttachFile />
  if(props.attachment.mimeType?.startsWith('image/')) {
    icon = <Image />;
  }
  else if(props.attachment.mimeType === 'application/pdf') {
    icon = <PictureAsPdf />;
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
        classes={{ primary: classes.ellipsis, secondary: classes.ellipsis }} 
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
