import {
    Breakdown,
    Gender
} from '@makeit/types';
import {
    Grid,
    makeStyles
} from '@material-ui/core';
import React, { useState } from 'react';
import { Ethnicity } from '../../../../../libs/types/src/base-enums.model';
import { Converter } from '../../app/converters';
import SelectInput from '../forms/SelectInput';
import TextInput from '../forms/TextInput';
import TitledPaper from '../layout/TitledPaper';
import ActionButtons from './ActionButtons';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    position: 'relative',
  },
}));

const BreakdownDetailsEdit = (props: {breakdown: Breakdown}) => {
  const classes = useStyles();
  const [breakdown, setBreakdown] = useState(null);

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
              <TextInput name="breakdown.roleName" label="Role Name" />
            </Grid>
            <Grid item xs={3}>
              <TextInput name="breakdown.roleType" label="Type" />
            </Grid>
            <Grid item xs={3}>
              <TextInput name="breakdown.rate" label="Rate / Pay" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <TextInput
            name="breakdown.roleDescription"
            label="Description"
            multiline
          />
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={3}>
              <SelectInput
                name="breakdown.gender"
                label="Gender"
                options={Converter.enumToOptions(Gender)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextInput
                name="breakdown.ageMin"
                label="Age (from)"
                type="number"
              />
            </Grid>
            <Grid item xs={3}>
              <TextInput
                name="breakdown.ageMax"
                label="Age (to)"
                type="number"
              />
            </Grid>
            <Grid item xs={3}>
              <SelectInput
                name="breakdown.ethnicities"
                label="Ethnicities"
                options={Converter.enumToOptions(Ethnicity)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ActionButtons />
    </TitledPaper>
  );
};

export default BreakdownDetailsEdit;
