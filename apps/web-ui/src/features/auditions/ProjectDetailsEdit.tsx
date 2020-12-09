import { Project, ProjectType, UnionType } from '@makeit/types';
import {
  FormControl,
  Grid,
  InputLabel,
  makeStyles
} from '@material-ui/core';
import { FastField } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { KeyboardDatePicker } from 'formik-material-ui-pickers';
import React from 'react';
import { Converter } from '../../app/Converters';
import TitledPaper from '../layout/TitledPaper';
import AttachmentButtons from '../attachments/AttachmentButtons';
import AttachmentPanel from '../attachments/AttachmentPanel';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    position: 'relative',
  },
}));

const ProjectDetailsEdit = (props: {project: Project}) => {
  const classes = useStyles();

  return (
    <TitledPaper
      variant="h6"
      component="h2"
      className={classes.attachmentContainer}
      title="Project Details"
    >
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <FastField
            component={TextField}
            name="breakdown.project.name"
            label="Project Name"
            fullWidth={true}
          />
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="project-type">Project Type</InputLabel>
                <FastField
                  component={Select}
                  name="breakdown.project.projectType"
                  inputProps={{
                    id: 'project-type',
                  }}
                >
                  {Converter.enumToMenuItems("ProjectType", ProjectType)}
                </FastField>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FastField
                component={KeyboardDatePicker}
                name="breakdown.project.startDate"
                label="Start Date"
                fullWidth={true}
                initialFocusedDate={null}
                format="MM/DD/YYYY"
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="union-status">Union Status</InputLabel>
                <FastField
                  component={Select}
                  name="breakdown.project.union"
                  inputProps={{
                    id: 'union-status',
                  }}
                  fullWidth={true}
                >
                  {Converter.enumToMenuItems("UnionType", UnionType)}
                </FastField>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <FastField
            component={TextField}
            name="breakdown.project.description"
            label="Description"
            multiline
            fullWidth={true}
          />
        </Grid>
        <Grid item>
          <AttachmentPanel container={props.project} />
        </Grid>
      </Grid>
    </TitledPaper>
  );
};

export default ProjectDetailsEdit;
