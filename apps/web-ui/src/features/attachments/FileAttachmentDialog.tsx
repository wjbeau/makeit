import { Attachment } from '@makeit/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Select,
  TextField,
} from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import React, { useState } from 'react';
import { AttachmentType } from '../../../../../libs/types/src/attachment.model';
import { uploadFile } from '../files/files.slice';
import { useAppDispatch } from '../../app/store';
import { logError } from '../logging/logging.slice';
import { Converter } from '../../app/Converters';
import { unwrapResult } from '@reduxjs/toolkit';

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
  const [file, setFile] = useState<File>(null);
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<string>('');
  const dispatch = useAppDispatch();

  const handleDisplayChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleFilesChange = (newVal) => {
    setFile(newVal.length ? newVal[0] : null);
  };

  const handleSave = () => {
    dispatch(
      uploadFile({
        displayName: description,
        attachmentType: type,
        file: file,
      })
    )
      .then(unwrapResult)
      .then((a) => {
        onSave([a]);
        onClose();
      })
      .catch((e) => dispatch(logError(e)));
  };

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Add File</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select the file to upload and add any additional information.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              name="displayName"
              label="Description"
              fullWidth={true}
              onChange={handleDisplayChange}
              value={description}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth={true} required>
              <InputLabel id="attachment-type-label">Type</InputLabel>
              <Select
                name="attachmentType"
                fullWidth={true}
                id="attachmentType"
                labelId="attachment-type-label"
                onChange={handleTypeChange}
                value={type}
                required
              >
                {Converter.enumToMenuItems('AttachmentType', AttachmentType)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <DropzoneArea
              filesLimit={1}
              showAlerts={false}
              showPreviews={false}
              onChange={handleFilesChange}
              onDelete={() => setFile(null)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary" disabled={file === null}>
          Upload
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileAttachmentDialog;
