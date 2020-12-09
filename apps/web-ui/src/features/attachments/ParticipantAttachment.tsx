import { Participant, ParticipantType, PersonInfo } from '@makeit/types';
import { Avatar, Chip, IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, Typography } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import * as _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuthed } from '../auth/auth.slice';
import { Converter } from '../../app/Converters';

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: theme.typography.caption.fontSize,
    marginLeft: '-1px',
  },
  name: {
    fontSize: '0.85rem',
    lineHeight: '0.9'
  },
  role: {
    fontSize: '0.65rem',
    lineHeight: '1.1'
  }
}));

const getInitials = (person: PersonInfo) => {
  const words = _.words(person.firstName + '' + person.lastName);
  return words.map((w) => _.capitalize(w).charAt(0)).join('');
};

export const ParticipantAttachment = (props: {
  participant: Participant;
  readOnly?: boolean;
}) => {
  const classes = useStyles();
  const user = useSelector(selectAuthed);
  const { participant, readOnly } = props;

  const handleDelete =
    !readOnly && user._id === participant.info.ref
      ? () => {
          console.log('Not yet implemented');
        }
      : undefined;
  const deleteIcon = !readOnly ? <Delete /> : undefined;
  const avatar = participant.info.avatar ? (
    <Avatar src={participant.info.avatar} className={classes.small}></Avatar>
  ) : (
    <Avatar className={classes.small}>{getInitials(participant.info)}</Avatar>
  );

  return (
    <ListItem button onClick={() => console.log("clicked: " + participant.info.ref)}>
      <ListItemAvatar>
        {avatar}
      </ListItemAvatar>
      <ListItemText primary={participant.info.firstName + ' ' + participant.info.lastName} secondary={Converter.getLabelForEnum(ParticipantType, participant.role)} />
      {!readOnly && <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete">
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>}
    </ListItem>
  );
};

export default ParticipantAttachment;
