import { Attachment, HasAttachments, HasParticipants, Link, Participant } from '@makeit/types';
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

function hasParticipants(c: HasAttachments|HasParticipants) {
    return c && 'participants' in c;
}

function hasAttachments(c: HasAttachments|HasParticipants) {
    return c && 'attachments' in c;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AttachmentButtons = (props: { children?: any, container: HasAttachments|HasParticipants }) => {
  const classes = useStyles();
  const {children, container} = props;
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
    const attachContainer = (container as HasAttachments);
    console.log("Attachment:")
    console.log(attachContainer)
    console.log(attachments)
    attachments.forEach(a => attachContainer.attachments.push(a));
    setOpen(false);
  }

  const saveLinks = (links: Link[]) => {
    const attachContainer = (container as HasAttachments);
    links.forEach(a => attachContainer.links.push(a));
    setOpen(false);
  }

  const saveParticipants = (participants: Participant[]) => {
    const attachContainer = (container as HasParticipants);
    participants.forEach(a => attachContainer.participants.push(a));
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
