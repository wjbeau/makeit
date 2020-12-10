import { Attachment } from '@makeit/types';
import { List, makeStyles } from '@material-ui/core';
import { FieldArray } from 'formik';
import React from 'react';
import FileAttachment from './FileAttachment';
import { HasAttachments } from '../../../../../libs/types/src/attachment.model';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const FileAttachmentList = (props: { container: HasAttachments, readOnly}) => {
  const classes = useStyles();
  const {container, readOnly} = props;
  
  return (
    <List className={classes.root} disablePadding={true}>
      {readOnly && container.attachments.map((a) => (
        <FileAttachment key={a.reference} attachment={a} />
      ))}
      {!readOnly && 
        <FieldArray
          name="attachment"
          render={(arrayHelpers) => {
            return container.attachments.map((a) => (
              <FileAttachment key={a.reference} attachment={a} />
            ))
          }} />
      }
    </List>
  );
};

export default FileAttachmentList;
