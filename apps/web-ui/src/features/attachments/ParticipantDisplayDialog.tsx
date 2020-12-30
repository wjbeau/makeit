/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, Typography } from '@material-ui/core';
import { Participant, ParticipantReferenceType, ParticipantType } from '@makeit/types';
import { useSelector } from 'react-redux';
import { selectContacts, selectContactsLoading } from '../contacts/contact.slice';
import IfNotLoading from '../layout/IfNotLoading';
import ContactDetails from '../contacts/ContactDetails';
import { Converter } from '../../app/Converters';

export const useStyles = makeStyles((theme) => ({
  root: {},
  label: {},
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginRight: theme.spacing(2),
  },
  mainContent: {
    overflow: 'hidden'
  }
}));

export const ParticipantDisplayDialog = (props: { participant: Participant, open: boolean, onClose: () => void }) => {
  const { participant, open, onClose } = props;
  const classes = useStyles();

  const contacts = useSelector(selectContacts)
  const contactsLoading = useSelector(selectContactsLoading)

  const getContact = (id) => {
      if(contactsLoading) {
        return contacts.find(c => c._id === id)
      }
      return null
  }


  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      <DialogContent className={classes.mainContent}>
        {participant.info.type === ParticipantReferenceType.Contact && (
          <IfNotLoading loading={contactsLoading}>
              <ContactDetails contact={getContact(participant.info.ref)} />
          </IfNotLoading>
        )}
        {participant.info.type !== ParticipantReferenceType.Contact && (
          <Grid container spacing={3}>
              <Grid item>
                  <Avatar src={participant.info.avatar} className={classes.avatar}>{Converter.getInitials(participant.info)}</Avatar>
              </Grid>
              <Grid item>
                  <Typography
                    variant="h5"
                    component="h2">{participant.info.firstName} {participant.info.lastName}</Typography>
                  <Typography
                      variant="body1"
                      component="p">{Converter.getLabelForEnum(ParticipantType, participant.role)}</Typography>
              </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParticipantDisplayDialog;
