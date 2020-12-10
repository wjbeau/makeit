import { Attachment } from '@makeit/types';
import { List, makeStyles } from '@material-ui/core';
import { FieldArray } from 'formik';
import React from 'react';
import FileAttachment from './FileAttachment';
import { HasAttachments } from '../../../../../libs/types/src/attachment.model';
import { FieldArrayHelperContainer } from './AttachmentPanel';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const FileAttachmentList = (props: { container: HasAttachments, readOnly, helpers?: FieldArrayHelperContainer}) => {
  const classes = useStyles();
  const {container, readOnly, helpers} = props;
  
  return (
    <List className={classes.root} disablePadding={true}>
      {readOnly && container.attachments.map((a) => (
        <FileAttachment key={a.reference} attachment={a} readOnly={readOnly}/>
      ))}
      {!readOnly && 
        <FieldArray
          name="attachments"
          render={(arrayHelpers) => {
            helpers.fileArrayHelper = arrayHelpers;
            return container.attachments.map((a, index) => (
              <FileAttachment key={a.reference} attachment={a} readOnly={readOnly} onDelete={() => arrayHelpers.remove(index)} />
            ))
          }} />
      }
    </List>
  );
};

export default FileAttachmentList;
