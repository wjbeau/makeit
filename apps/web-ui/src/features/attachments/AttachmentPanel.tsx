import { hasAttachments, HasAttachments, hasParticipants, HasParticipants } from '@makeit/types';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { display } from '@material-ui/system';
import React, { useState } from 'react';
import AttachmentButtons from './AttachmentButtons';
import FileAttachmentList from './FileAttachmentList';
import LinkAttachmentList from './LinkAttachmentList';
import ParticipantAttachmentList from './ParticipantAttachmentList';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    marginTop: theme.spacing(2),
  },
  bold: {
    fontWeight: 'bold',
  },
  hidden: {
    display: 'none',
  },
}));

export const AttachmentPanel = (props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
  container: HasAttachments | HasParticipants;
}) => {
  const classes = useStyles();
  const { container } = props;
  let fileArrayHelper;
  let linkArrayHelper;
  let participantArrayHelper;
  const showFiles = (container as HasAttachments).attachments?.length > 0 ? null : classes.hidden;
  const showLinks = (container as HasAttachments).links?.length > 0 ? null : classes.hidden;
  const showParticipants = (container as HasParticipants).participants?.length > 0 ? null : classes.hidden;

  return (
    <Grid container spacing={3} direction="column">
      {(hasAttachments(container)) && <Grid item className={showFiles}>
        <Typography variant="body2" className={classes.bold}>
          Files
        </Typography>
        <FileAttachmentList
          container={container as HasAttachments}
          readOnly={false}
        />
      </Grid>}
      {(hasAttachments(container)) && <Grid item className={showLinks}>
        <Typography variant="body2" className={classes.bold}>
          Links
        </Typography>
        <LinkAttachmentList
          container={container as HasAttachments}
          readOnly={false}
        />
      </Grid>}
      {(hasParticipants(container)) && <Grid item className={showParticipants}>
        <Typography variant="body2" className={classes.bold}>
          Participants
        </Typography>
        <ParticipantAttachmentList
          container={container as HasParticipants}
          readOnly={false}
        />
      </Grid>}
      <Grid item>
        <AttachmentButtons
          container={container}
        >
          {props.children}
        </AttachmentButtons>
      </Grid>
    </Grid>
  );
};

export default AttachmentPanel;
