import { Participant, ParticipantType, PersonInfo } from '@makeit/types';
import {
  Avatar,
  Chip,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Modal,
  Typography,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import * as _ from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthed } from '../auth/auth.slice';
import { Converter } from '../../app/Converters';
import ParticipantDisplayDialog from './ParticipantDisplayDialog';

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: theme.typography.caption.fontSize,
    marginLeft: '-1px',
  },
  ellipsis: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  name: {
    fontSize: '0.85rem',
    lineHeight: '0.9',
  },
  role: {
    fontSize: '0.65rem',
    lineHeight: '1.1',
  },
}));

export const ParticipantAttachment = (props: {
  participant: Participant;
  readOnly?: boolean;
  onDelete?: () => void;
}) => {
  const classes = useStyles();
  const [participantOpen, setParticipantOpen] = useState<boolean>(false);
  const { participant, readOnly, onDelete } = props;

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };
  const avatar = participant.info.avatar ? (
    <Avatar src={participant.info.avatar} className={classes.small}></Avatar>
  ) : (
    <Avatar className={classes.small}>
      {Converter.getInitials(participant.info)}
    </Avatar>
  );

  return (
    <>
      <ListItem button onClick={() => setParticipantOpen(true)}>
        <ListItemAvatar>{avatar}</ListItemAvatar>
        <ListItemText
          primary={participant.info.firstName + ' ' + participant.info.lastName}
          secondary={Converter.getLabelForEnum(
            ParticipantType,
            participant.role
          )}
          classes={{ primary: classes.ellipsis, secondary: classes.ellipsis }}
        />
        {!readOnly && (
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
      <ParticipantDisplayDialog
        participant={participant}
        open={participantOpen}
        onClose={() => setParticipantOpen(false)}
      />
    </>
  );
};

export default ParticipantAttachment;
