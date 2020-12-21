import { Project, ProjectStatus } from '@makeit/types';
import { IconButton, Tooltip } from '@material-ui/core';
import { Cancel, Done } from '@material-ui/icons';
import React from 'react';
import { Converter } from '../../app/Converters';
import { useAppDispatch } from '../../app/store';
import { logError, logSuccess } from '../logging/logging.slice';
import { saveProject } from '../projects/project.slice';
import ProjectEditButton from './ProjectEditButton';

export const ProjectCardActions = (props: { project: Project }) => {
  const { project } = props;
  const dispatch = useAppDispatch();

  const markAsStatus = (newStatus: ProjectStatus) => {
    const oldStatus = project.status;
    project.status = newStatus;
    dispatch(saveProject(project))
      .then((p) => {
        dispatch(
          logSuccess({
            message:
              'Project marked as ' +
              Converter.getLabelForEnum(ProjectStatus, newStatus),
          })
        );
      })
      .catch((e) => {
        project.status = oldStatus;
        dispatch(logError(e));
      });
  };

  return (
    <>
      <ProjectEditButton id={project._id} />
      {project.status === ProjectStatus.Active && (
        <>
          <Tooltip title="Mark as Completed" aria-label="mark as completed">
            <IconButton
              aria-label="mark as completed"
              onClick={() => markAsStatus(ProjectStatus.Completed)}
            >
              <Done />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark as Cancelled" aria-label="mark as cancelled">
            <IconButton
              aria-label="mark as cancelled"
              onClick={() => markAsStatus(ProjectStatus.Cancelled)}
            >
              <Cancel />
            </IconButton>
          </Tooltip>
        </>
      )}
    </>
  );
};

export default ProjectCardActions;
