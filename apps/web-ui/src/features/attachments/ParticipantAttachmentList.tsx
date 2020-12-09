import { Participant } from '@makeit/types';
import { List, makeStyles } from '@material-ui/core';
import React from 'react';
import ParticipantAttachment from './ParticipantAttachment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const ParticipantAttachmentList = (props: { participants: Participant[], readOnly?: boolean }) => {
  const classes = useStyles();
  return (
    <List className={classes.root} disablePadding={true}>
      {props.participants.map((a) => (
        <ParticipantAttachment key={a.info.ref} participant={a} readOnly={props.readOnly} />
      ))}
    </List>
  );
};

export default ParticipantAttachmentList;
