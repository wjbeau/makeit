import { Attachment, hasAttachments, HasAttachments, hasParticipants, HasParticipants, Link, Participant } from '@makeit/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import {
  AttachFile,
  Link as LinkIcon,
  PersonAdd,
} from '@material-ui/icons';
import React, { useState } from 'react';
import { FieldArrayHelperContainer } from './AttachmentPanel';
import FileAttachmentDialog from './FileAttachmentDialog';
import LinkAttachmentDialog from './LinkAttachmentDialog';
import ParticipantAttachmentDialog from './ParticipantAttachmentDialog';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    marginTop: theme.spacing(0),
  },
  button: {
    marginRight: theme.spacing(1),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AttachmentButtons = (props: { children?: any, container: HasAttachments|HasParticipants, helpers: FieldArrayHelperContainer }) => {
  const classes = useStyles();
  const {children, container, helpers} = props;
  const [open, setOpen] = useState<boolean>(false);
  const [attachType, setAttachType] = useState<string>();

  const attach = (type: string) => {
    setAttachType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveAttachments = (attachments: Attachment[]) => {
    //TODO fix this
    console.log("Attach")
    console.log(attachments)
    console.log(helpers.fileArrayHelper)
    attachments?.forEach(a => helpers.fileArrayHelper?.push(a))
    setOpen(false);
  }

  const saveLinks = (links: Link[]) => {
    //TODO fix this
    console.log("Attach")
    console.log(links)
    links?.forEach(a => helpers.linkArrayHelper?.push(a))
    setOpen(false);
  }

  const saveParticipants = (participants: Participant[]) => {
    //TODO fix this
    console.log("Attach")
    console.log(participants)
    participants?.forEach(a => helpers.participantArrayHelper?.push(a))
    setOpen(false);
  }

  return (
    <div className={classes.attachmentContainer}>
      {(hasAttachments(container)) && <Button
        startIcon={<AttachFile />}
        color="primary"
        variant="text"
        className={classes.button}
        onClick={() => attach('File')}
      >
        Add File
      </Button>}
      {(hasAttachments(container)) && <Button
        startIcon={<LinkIcon />}
        color="primary"
        variant="text"
        className={classes.button}
        onClick={() => attach('Link')}
      >
        Add Link
      </Button>}
      {(hasParticipants(container)) && <Button
        startIcon={<PersonAdd />}
        color="primary"
        variant="text"
        className={classes.button}
        onClick={() => attach('Participant')}
      >
        Add Participant
      </Button>}
      {children}
      <FileAttachmentDialog open={open && attachType === 'File'} onClose={handleClose} onSave={saveAttachments} />
      <LinkAttachmentDialog open={open && attachType === 'Link'} onClose={handleClose} onSave={saveLinks} />
      <ParticipantAttachmentDialog open={open && attachType === 'Participant'} onClose={handleClose} onSave={saveParticipants} />
    </div>
  );
};

export default AttachmentButtons;
