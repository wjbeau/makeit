import { Attachment } from '@makeit/types';
import { List, makeStyles } from '@material-ui/core';
import React from 'react';
import FileAttachment from './FileAttachment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const FileAttachmentList = (props: { attachments: Attachment[] }) => {
  const classes = useStyles();
  
  return (
    <List className={classes.root} disablePadding={true}>
      {props.attachments.map((a) => (
        <FileAttachment key={a.reference} attachment={a} />
      ))}
    </List>
  );
};

export default FileAttachmentList;
