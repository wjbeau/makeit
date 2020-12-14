import { Breakdown, Gender, Ethnicity } from '@makeit/types';
import { FormControl, Grid, InputLabel, makeStyles } from '@material-ui/core';
import { FastField } from 'formik';
import { Select, TextField } from 'formik-material-ui';
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

const BreakdownDetailsEdit = (props: { breakdown: Breakdown }) => {
  const classes = useStyles();

  return (
    <TitledPaper
      variant="h6"
      component="h2"
      className={classes.attachmentContainer}
      title="Role/Breakdown Details"
    >
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={6}>
              <FastField
                component={TextField}
                name="breakdown.roleName"
                label="Role Name"
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={3}>
              <FastField
                component={TextField}
                name="breakdown.roleType"
                label="Type"
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={3}>
              <FastField
                component={TextField}
                name="breakdown.rate"
                label="Rate / Pay"
                fullWidth={true}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <FastField
            component={TextField}
            name="breakdown.roleDescription"
            label="Description"
            multiline
            fullWidth={true}
          />
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={3}>
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="gender">Gender</InputLabel>
                <FastField
                  component={Select}
                  name="breakdown.gender"
                  inputProps={{
                    id: 'gender',
                  }}
                >
                  {Converter.enumToMenuItems('Gender', Gender)}
                </FastField>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FastField
                component={TextField}
                name="breakdown.ageMin"
                label="Age (from)"
                type="number"
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={3}>
              <FastField
                component={TextField}
                name="breakdown.ageMax"
                label="Age (to)"
                type="number"
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="ethnicities">Ethnicities</InputLabel>
                <FastField
                  component={Select}
                  name="breakdown.ethnicities"
                  inputProps={{
                    id: 'ethnicities',
                  }}
                  multiple
                >
                  {Converter.enumToMenuItems('Ethnicity', Ethnicity)}
                </FastField>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AttachmentPanel container={props.breakdown} rootPath="breakdown" />
    </TitledPaper>
  );
};

export default BreakdownDetailsEdit;
