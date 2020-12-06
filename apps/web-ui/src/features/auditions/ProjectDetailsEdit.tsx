import { Project, ProjectType, UnionType } from '@makeit/types';
import { Grid, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { Converter } from '../../app/converters';
import DatePickerInput from '../forms/DatePickerInput';
import SelectInput from '../forms/SelectInput';
import TextInput from '../forms/TextInput';
import TitledPaper from '../layout/TitledPaper';
import ActionButtons from './ActionButtons';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    position: 'relative',
  },
}));

const ProjectDetailsEdit = (props: {project: Project}) => {
  const classes = useStyles();
  const [project, setProject] = useState(null);

  return (
    <TitledPaper
      variant="h6"
      component="h2"
      className={classes.attachmentContainer}
      title="Project Details"
    >
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <TextInput name="breakdown.project.name" label="Project Name" />
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={4}>
              <SelectInput
                name="breakdown.project.type"
                label="Project Type"
                options={Converter.enumToOptions(ProjectType)}
              />
            </Grid>
            <Grid item xs={4}>
              <DatePickerInput
                name="breakdown.project.startDate"
                label="Start Date"
              />
            </Grid>
            <Grid item xs={4}>
              <SelectInput
                name="breakdown.project.union"
                label="Union Status"
                options={Converter.enumToOptions(UnionType)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <TextInput
            name="breakdown.project.description"
            label="Description"
            multiline
          />
        </Grid>
      </Grid>
      <ActionButtons />
    </TitledPaper>
  );
};

export default ProjectDetailsEdit;
