import { Attachment } from '@makeit/types';
import {
  makeStyles
} from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone';
import React, { useState } from 'react';

const MAX_FILE_SIZE = 5000000;

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(1),
  },
}));

export const FileAttachmentDialog = (props: {
  open: boolean;
  onSave: (attachments: Attachment[]) => void;
  onClose: () => void;
}) => {
  const classes = useStyles();
  const { open, onSave, onClose } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [files, setFiles] = useState<any[]>([]);

  const handleSave = (uploaded) => {
    //TODO upload files to server
    setFiles(uploaded);
    const attachments = uploaded.map(u => {
      //TODO implement this
      return u;
    })
    props.onSave(attachments)
  };

  return (
    <DropzoneDialog
      open={open}
      onSave={handleSave}
      showPreviews={true}
      maxFileSize={MAX_FILE_SIZE}
      onClose={onClose}
    />
  );
};

export default FileAttachmentDialog;
