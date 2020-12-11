import { Link } from '@makeit/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
  TextField,
} from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(1),
  },
}));

export const LinkAttachmentDialog = (props: {
  open: boolean;
  onSave: (links: Link[]) => void;
  onClose: () => void;
}) => {
  const classes = useStyles();
  const { open, onSave, onClose } = props;
  const [description, setDescription] = useState<string>();
  const [url, setUrl] = useState<string>();

  const handleDisplayChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSave = () => {
    const link: Link = {
      display: description,
      url: url
    }
    props.onSave([link]);
  };

  const hasUrl = () => {
    return url && url.length > 0
  }

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Add Link</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter the link details.</DialogContentText>
        <Grid container spacing={2} direction="column">
          <Grid>
            <TextField
              name="displayName"
              label="Description"
              fullWidth={true}
              onChange={handleDisplayChange}
            />
          </Grid>
          <Grid>
            <TextField
              name="url"
              label="URL"
              fullWidth={true}
              onChange={handleUrlChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary" disabled={!hasUrl()} >
          Add
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkAttachmentDialog;
