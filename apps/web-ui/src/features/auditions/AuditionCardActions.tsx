import { Audition, AuditionStatus } from '@makeit/types';
import {
  IconButton,


  Tooltip
} from '@material-ui/core';
import {
  Block, CheckCircle,
  Done,





  PermMedia, ThumbUp
} from '@material-ui/icons';
import React from 'react';
import { Converter } from '../../app/Converters';
import { useAppDispatch } from '../../app/store';
import { logError, logSuccess } from '../logging/logging.slice';
import { saveAudition } from './audition.slice';
import AuditionEditButton from './AuditionEditButton';

export const AuditionCardActions = (props: { audition: Audition }) => {
  const { audition } = props;
  const dispatch = useAppDispatch();

  const markAsStatus = (newStatus: AuditionStatus) => {
    const oldStatus = audition.status;
    audition.status = newStatus;
    dispatch(saveAudition(audition))
      .then((p) => {
        dispatch(
          logSuccess({
            message:
              'Audition marked as ' +
              Converter.getLabelForEnum(AuditionStatus, newStatus),
          })
        );
      })
      .catch((e) => {
        audition.status = oldStatus;
        dispatch(logError(e));
      });
  };

  return (
    <>
      <AuditionEditButton id={audition._id} />
      {audition.status === AuditionStatus.Accepted && (
        <Tooltip title="Mark as Done" aria-label="mark as done">
          <IconButton
            aria-label="mark as done"
            onClick={() => markAsStatus(AuditionStatus.Performed)}
          >
            <Done />
          </IconButton>
        </Tooltip>
      )}
      {audition.status === AuditionStatus.Invited && (
        <Tooltip title="Mark as Accepted" aria-label="mark as accepted">
          <IconButton
            aria-label="mark as accepted"
            onClick={() => markAsStatus(AuditionStatus.Accepted)}
          >
            <ThumbUp />
          </IconButton>
        </Tooltip>
      )}
      {audition.status === AuditionStatus.Performed && (
        <>
          <Tooltip title="Mark as Successful" aria-label="mark as successful">
            <IconButton
              aria-label="mark as successful"
              onClick={() => markAsStatus(AuditionStatus.Successful)}
            >
              <CheckCircle />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Mark as Unsuccessful"
            aria-label="mark as unsuccessful"
          >
            <IconButton
              aria-label="mark as unsuccessful"
              onClick={() => markAsStatus(AuditionStatus.Rejected)}
            >
              <Block />
            </IconButton>
          </Tooltip>
        </>
      )}
      {audition.status === AuditionStatus.Successful && (
        <Tooltip title="Convert to Project" aria-label="convert to project">
          <IconButton
            aria-label="convert to project"
            onClick={() => console.log('Not yet implemented')}
          >
            <PermMedia />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default AuditionCardActions;
