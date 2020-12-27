import {
  Audition,
  AuditionStatus,
  ProjectStatus,
  ModelFactory,
  AuditionType,
} from '@makeit/types';
import { IconButton, Tooltip } from '@material-ui/core';
import {
  Block,
  Cancel,
  CheckCircle,
  Done,
  MeetingRoom,
  PermMedia,
  ThumbUp,
} from '@material-ui/icons';
import React from 'react';
import { Converter } from '../../app/Converters';
import { useAppDispatch } from '../../app/store';
import { logError, logSuccess } from '../logging/logging.slice';
import { saveProject } from '../projects/project.slice';
import { saveAudition } from './audition.slice';
import AuditionEditButton from './AuditionEditButton';
import { useHistory } from 'react-router-dom';

export const AuditionCardActions = (props: { audition: Audition }) => {
  const { audition } = props;
  const dispatch = useAppDispatch();
  const history = useHistory();

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

  const createCallback = () => {
    const newAudition = ModelFactory.createEmptyAudition(
      AuditionStatus.Accepted,
      AuditionType.Callback
    );
    newAudition.source = audition.source;
    newAudition.breakdown = audition.breakdown;
    newAudition.followUpTo = audition;
    history.push({
      pathname: '/auditions/new/edit',
      state: { initial: newAudition },
    });
  };

  const activateProject = () => {
    const oldStatus = audition.breakdown.project.status;
    audition.breakdown.project.status = ProjectStatus.Active;

    dispatch(saveProject(audition.breakdown.project))
      .then((p) => {
        dispatch(
          logSuccess({
            message: 'Project saved.',
          })
        );
      })
      .catch((e) => {
        audition.breakdown.project.status = oldStatus;
        dispatch(logError(e));
      });
  };

  return (
    <>
      <AuditionEditButton id={audition._id} />
      {audition.status === AuditionStatus.Accepted && (
        <>
          <Tooltip title="Mark as Done" aria-label="mark as done">
            <IconButton
              aria-label="mark as done"
              onClick={() => markAsStatus(AuditionStatus.Performed)}
            >
              <Done />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark as Cancelled" aria-label="mark as cancelled">
            <IconButton
              aria-label="mark as cancelled"
              onClick={() => markAsStatus(AuditionStatus.Cancelled)}
            >
              <Cancel />
            </IconButton>
          </Tooltip>
        </>
      )}
      {audition.status === AuditionStatus.Invited && (
        <>
          <Tooltip title="Mark as Accepted" aria-label="mark as accepted">
            <IconButton
              aria-label="mark as accepted"
              onClick={() => markAsStatus(AuditionStatus.Accepted)}
            >
              <ThumbUp />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark as Cancelled" aria-label="mark as cancelled">
            <IconButton
              aria-label="mark as cancelled"
              onClick={() => markAsStatus(AuditionStatus.Cancelled)}
            >
              <Cancel />
            </IconButton>
          </Tooltip>
        </>
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
        <Tooltip
          title="Create Callback"
          aria-label="create a callback audition"
        >
          <IconButton
            aria-label="create a callback audition"
            onClick={createCallback}
          >
            <MeetingRoom />
          </IconButton>
        </Tooltip>
      )}
      {audition.status === AuditionStatus.Successful &&
        audition.breakdown?.project?.status === ProjectStatus.Provisional && (
          <Tooltip title="Convert to Project" aria-label="convert to project">
            <IconButton
              aria-label="convert to project"
              onClick={activateProject}
            >
              <PermMedia />
            </IconButton>
          </Tooltip>
        )}
    </>
  );
};

export default AuditionCardActions;
