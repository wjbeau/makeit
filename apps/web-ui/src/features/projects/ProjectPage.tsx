import { Button, Grid } from '@material-ui/core';
import { AddBoxOutlined } from '@material-ui/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import IfNotLoading from '../layout/IfNotLoading';
import TitledSection from '../layout/TitledSection';
import ActiveProjects from './ActiveProjects';
import { selectProjectsLoading } from './project.slice';
import ProjectsList from './ProjectsList';

export const ProjectPage = () => {
  const history = useHistory();

  const handleAdd = () => {
    history.push('projects/new/edit');
  };

  return (
    <Grid container direction="column" spacing={5}>
    <Grid item>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        startIcon={<AddBoxOutlined />}
      >
        New Project
      </Button>
    </Grid>
    <Grid container direction="row" spacing={3}>
      <Grid item xs={12}>
        <ActiveProjects />
      </Grid>
      <Grid item xs={12}>
        <TitledSection variant="h6" component="h2" title="All Projects">
          <ProjectsList />
        </TitledSection>
      </Grid>
    </Grid>
    </Grid>
  );
}

export default ProjectPage;
