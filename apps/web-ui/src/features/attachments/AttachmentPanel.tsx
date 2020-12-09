import { HasAttachments, HasParticipants } from '@makeit/types';
import {
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import React from 'react';
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
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AttachmentPanel = (props: { children?: any, container: HasAttachments|HasParticipants }) => {
  const classes = useStyles();
  const { container } = props;

  return (
    <Grid container spacing={3} direction="column">
      {(container as HasAttachments).attachments?.length > 0 && <Grid item>
        <Typography variant="body2" className={classes.bold}>Attachments</Typography>
        <FileAttachmentList attachments={(container as HasAttachments).attachments} />
      </Grid>}
      {(container as HasAttachments).links?.length > 0 && <Grid item>
        <Typography variant="body2" className={classes.bold}>Links</Typography>
        <LinkAttachmentList links={(container as HasAttachments).links} />
      </Grid>}
      {(container as HasParticipants).participants?.length > 0 && <Grid item>
        <Typography variant="body2" className={classes.bold}>Participants</Typography>
        <ParticipantAttachmentList participants={(container as HasParticipants).participants} />
      </Grid>}
      <Grid item>
        <AttachmentButtons container={container}>
          {props.children}
        </AttachmentButtons>
      </Grid>
    </Grid>
  );
};

export default AttachmentPanel;
