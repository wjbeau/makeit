import { Participant } from '@makeit/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles
} from '@material-ui/core';
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

export const ParticipantAttachmentDialog = (props: {
  open: boolean;
  onSave: (participant: Participant[]) => void;
  onClose: () => void;
}) => {
  const classes = useStyles();
  const { open, onSave, onClose } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [files, setFiles] = useState<any[]>([]);

  return (
    <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={open}
        onClose={onClose}
      >
        <DialogTitle>Add Link</DialogTitle>
        <DialogContent>
          <DialogContentText>
            TODO
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Add
          </Button>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default ParticipantAttachmentDialog;
