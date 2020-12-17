import { Audition, AuditionStatus, ProjectStatus } from '@makeit/types';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Converter } from '../../app/Converters';
import { useAppDispatch } from '../../app/store';
import { selectAuthed } from '../auth/auth.slice';
import IfNotLoading from '../layout/IfNotLoading';
import TitledSection from '../layout/TitledSection';
import { logError } from '../logging/logging.slice';
import { selectProjects, selectProjectsLoading, fetchProjects } from './project.slice';
import ProjectCard from './ProjectCard';

const useStyles = makeStyles((theme) => ({
  noContent: {
    justifyContent: 'center',
  },
}));

const isFuture = (dates: Date[]) => {
  const result = dates.find(
    (d) => d && new Date().getTime() - d.getTime() <= 0
  );
  return result;
};

export const ActiveProjects = () => {
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectProjectsLoading);
  const projectsRaw = useSelector(selectProjects);
  const projects = projectsRaw.map((a) => Converter.convertAllDates(a));
  const activeProjects: Audition[] = projects
    .filter((a) => a.status === ProjectStatus.Active)
    .sort((a, b) => {
      if (a.startDate && b.startDate) return b.startDate - a.startDate;
      if (a.startDate && !b.startDate) return -1;
      if (!a.startDate && b.startDate) return 1;
      return 0;
    });
  const classes = useStyles();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!projects.length && !loading) {
      dispatch(fetchProjects(user?.userId ?? 'notnull'))
        .then(unwrapResult)
        .catch((error) => dispatch(logError(error)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {activeProjects.length > 0 && (
        <TitledSection variant="h6" component="h2" title="Active Projects">
          <IfNotLoading loading={loading}>
            <Grid container direction="column" spacing={2}>
              {activeProjects.length > 0 &&
                activeProjects.map((m) => (
                  <Grid item key={m._id} xs={12} md={6}>
                    <ProjectCard project={m} />
                  </Grid>
                ))}
            </Grid>
          </IfNotLoading>
        </TitledSection>
      )}
    </>
  );
};

export default ActiveProjects;
