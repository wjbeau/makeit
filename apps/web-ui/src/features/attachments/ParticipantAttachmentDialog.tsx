import {
  Participant,
  ParticipantReferenceType,
  ParticipantType,
} from '@makeit/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  makeStyles,
  Select,
  TextField,
  FormControl,
} from '@material-ui/core';
import React, { useState } from 'react';
import { Converter } from '../../app/Converters';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(1),
  }
}));

export const ParticipantAttachmentDialog = (props: {
  open: boolean;
  onSave: (participant: Participant[]) => void;
  onClose: () => void;
}) => {
  const classes = useStyles();
  const { open, onSave, onClose } = props;
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [type, setType] = useState<ParticipantType>();

  const hasName = () => {
    return firstName && firstName.length > 0 && lastName && lastName.length > 0;
  }
  
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleSave = () => {
    const participant: Participant = {
      info: {
        firstName: firstName,
        lastName: lastName,
        avatar: null,
        ref: null,
        type: ParticipantReferenceType.Name,
      },
      role: type,
    };
    props.onSave([participant]);
  };

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Add Participant</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter the participant's details.</DialogContentText>
        <Grid container spacing={2} direction="row">
          <Grid item xs={4}>
            <TextField
              name="firstName"
              label="First Name"
              fullWidth={true}
              onChange={handleFirstNameChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="lastName"
              label="Last Name"
              fullWidth={true}
              onChange={handleLastNameChange}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth={true}>
              <InputLabel id="participant-type-label">Role</InputLabel>
              <Select
                labelId="participant-type-label"
                name="participantType"
                id="participantType"
                onChange={handleTypeChange}
              >
                {Converter.enumToMenuItems('ParticipantType', ParticipantType)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary" disabled={!hasName()} >
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
