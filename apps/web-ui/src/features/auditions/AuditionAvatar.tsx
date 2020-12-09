import { Audition, AuditionStatus } from '@makeit/types';
import { Avatar, makeStyles, Tooltip } from '@material-ui/core';
import { Block, Cancel, CheckCircle, Done, Warning } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    background: theme.palette.info.dark,
  },
  audition: {
    background: theme.palette.info.light,
  },
  callback: {
    background: theme.palette.info.main,
  },
  iconContainer: {
    position: 'absolute',
    top: '24px',
    left: '24px'
  },
  successIcon: {
    color: theme.palette.success.dark,
    background: 'white',
    border: '1px solid white',
    borderRadius: '999px'
  },
  rejectIcon: {
    color: theme.palette.error.dark,
    background: 'white',
    border: '1px solid white',
    borderRadius: '999px'
  },
  cancelIcon: {
    color: theme.palette.grey[600],
    background: 'white',
    border: '1px solid white',
    borderRadius: '999px'
  },
  warningIcon: {
    color: theme.palette.warning.dark,
    background: 'white',
    border: '1px solid white',
    borderRadius: '999px'
  },
  performedIcon: {
    color: theme.palette.info.dark,
    background: 'white',
    border: '1px solid white',
    borderRadius: '999px'
  },
}));

const withinDay = (date: Date, otherDate: Date) => {
  let when = date;
  if (!when) {
    when = otherDate;
  }
  if (!when) {
    return false;
  }
  const now = new Date();
  const diff = when.getTime() - now.getTime();

  return diff < 1000 * 60 * 60 * 24; //is the due date within a day
};

const isSoon = (audition: Audition) => {
  switch (audition.status) {
    case AuditionStatus.Performed:
    case AuditionStatus.Rejected:
    case AuditionStatus.Cancelled:
    case AuditionStatus.Successful:
      return false;
    default:
      return withinDay(audition.deadline, audition.auditionTime);
  }
};

export const AuditionAvatar = (props: { audition: Audition }) => {
  const { audition } = props;
  const classes = useStyles();
  const typeName = audition.type?.toLowerCase();

  const firstLetter = () => {
    const letter = audition.type?.substring(0, 1).toUpperCase();
    return letter && letter !== 'I' ? letter : 'A';
  };

  return (
    <div className={classes.avatarContainer}>
      <Avatar
        aria-label={audition.type}
        className={classes[typeName] ? classes[typeName] : classes.avatar}
      >
        {firstLetter()}
      </Avatar>
      <span className={classes.iconContainer}>
        {isSoon(audition) && (
          <Tooltip title="Warning" aria-label="warning">
            <Warning className={classes.warningIcon} fontSize="small"></Warning>
          </Tooltip>
        )}
        {audition.status === AuditionStatus.Cancelled && (
          <Tooltip title="Cancelled" aria-label="cancelled">
            <Cancel className={classes.cancelIcon} fontSize="small"></Cancel>
          </Tooltip>
        )}
        {audition.status === AuditionStatus.Successful && (
          <Tooltip title="Successful" aria-label="successful">
            <CheckCircle
              className={classes.successIcon}
              fontSize="small"
            ></CheckCircle>
          </Tooltip>
        )}
        {audition.status === AuditionStatus.Rejected && (
          <Tooltip title="Unsuccessful" aria-label="unsuccessful">
            <Block className={classes.rejectIcon} fontSize="small"></Block>
          </Tooltip>
        )}
        {audition.status === AuditionStatus.Performed && (
          <Tooltip title="Done" aria-label="done">
            <Done className={classes.performedIcon} fontSize="small"></Done>
          </Tooltip>
        )}
      </span>
    </div>
  );
};

export default AuditionAvatar;
