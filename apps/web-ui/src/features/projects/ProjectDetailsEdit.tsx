import { Project, ProjectStatus, ProjectType, UnionType, ProjectSource } from '@makeit/types';
import { FormControl, Grid, InputLabel, makeStyles } from '@material-ui/core';
import { FastField } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { KeyboardDatePicker } from 'formik-material-ui-pickers';
import React from 'react';
import { Converter } from '../../app/Converters';
import TitledPaper from '../layout/TitledPaper';
import AttachmentPanel from '../attachments/AttachmentPanel';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    position: 'relative',
  },
}));

const getPath = (prefix: string, path: string) => {
  if(prefix) { 
    return prefix + '.' + path;
  }
  else {
    return path
  }
}

const ProjectDetailsEdit = (props: { project: Project, formikPrefix: string, showSource?: boolean }) => {
  const classes = useStyles();
  const { project, formikPrefix, showSource } = props

  return (
    <TitledPaper
      variant="h6"
      component="h2"
      className={classes.attachmentContainer}
      title="Project Details"
    >
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={8}>
              <FastField
                component={TextField}
                name={getPath(formikPrefix, "name")}
                label="Project Name"
                fullWidth={true}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth={true} required>
                <InputLabel htmlFor="project-status">Status</InputLabel>
                <FastField
                  component={Select}
                  name={getPath(formikPrefix, "status")}
                  inputProps={{
                    id: 'project-status',
                  }}
                  fullWidth={true}
                >
                  {Converter.enumToMenuItems('ProjectStatus', ProjectStatus, [ProjectStatus.Provisional])}
                </FastField>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={showSource ? 3: 4}>
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="project-type">Project Type</InputLabel>
                <FastField
                  component={Select}
                  name={getPath(formikPrefix, "projectType")}
                  inputProps={{
                    id: 'project-type',
                  }}
                >
                  {Converter.enumToMenuItems('ProjectType', ProjectType)}
                </FastField>
              </FormControl>
            </Grid>
            <Grid item xs={showSource ? 3: 4}>
              <FastField
                component={KeyboardDatePicker}
                name={getPath(formikPrefix, "startDate")}
                label="Start Date"
                fullWidth={true}
                initialFocusedDate={null}
                format="MM/DD/YYYY"
              />
            </Grid>
            <Grid item xs={showSource ? 3: 4}>
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="union-status">Union Status</InputLabel>
                <FastField
                  component={Select}
                  name={getPath(formikPrefix, "union")}
                  inputProps={{
                    id: 'union-status',
                  }}
                  fullWidth={true}
                >
                  {Converter.enumToMenuItems('UnionType', UnionType)}
                </FastField>
              </FormControl>
            </Grid>
            {showSource && <Grid item xs={3}>
              <FormControl fullWidth={true} required>
                <InputLabel htmlFor="project-source">Source</InputLabel>
                <FastField
                  component={Select}
                  name={getPath(formikPrefix, "source")}
                  inputProps={{
                    id: 'project-source',
                  }}
                  fullWidth={true}
                >
                  {Converter.enumToMenuItems('ProjectSource', ProjectSource)}
                </FastField>
              </FormControl>
            </Grid>}
          </Grid>
        </Grid>
        <Grid item>
          <FastField
            component={TextField}
            name={getPath(formikPrefix, "description")}
            label="Description"
            multiline
            fullWidth={true}
          />
        </Grid>
      </Grid>
      <AttachmentPanel container={project} rootPath={formikPrefix} />
    </TitledPaper>
  );
};

export default ProjectDetailsEdit;
