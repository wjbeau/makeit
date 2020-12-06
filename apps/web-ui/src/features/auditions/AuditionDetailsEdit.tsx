import { AuditionStatus, AuditionType } from '@makeit/types';
import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { Converter } from '../../app/converters';
import DatePickerInput from '../forms/DatePickerInput';
import DateTimePickerInput from '../forms/DatePickerTimeInput';
import SelectInput from '../forms/SelectInput';
import TextInput from '../forms/TextInput';
import TitledPaper from '../layout/TitledPaper';
import ActionButtons from './ActionButtons';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    position: 'relative',
  },
}));

const AuditionDetailsEdit = () => {
  const classes = useStyles();

  return (
    <TitledPaper
      variant="h6"
      component="h2"
      className={classes.attachmentContainer}
      title="Audition Details"
    >
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={2}>
              <SelectInput
                name="type"
                label="Type"
                options={Converter.enumToOptions(AuditionType)}
              />
            </Grid>
            <Grid item xs={2}>
              <DateTimePickerInput name="auditionTime" label="Date / Time" />
            </Grid>
            <Grid item xs={2}>
              <DateTimePickerInput name="deadline" label="Deadline" />
            </Grid>
            <Grid item xs={2}>
              <DatePickerInput name="callbackDate" label="Callback Date" />
            </Grid>
            <Grid item xs={2}>
              <SelectInput
                name="status"
                label="Status"
                options={Converter.enumToOptions(AuditionStatus)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <TextInput name="instructions" label="Instructions" multiline />
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={3}>
              <TextInput name="address.line1" label="Address Line 1" />
            </Grid>
            <Grid item xs={3}>
              <TextInput name="address.line2" label="Line 2" />
            </Grid>
            <Grid item xs={3}>
              <TextInput name="address.city" label="City" />
            </Grid>
            <Grid item xs={3}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextInput name="address.state" label="State" />
                </Grid>
                <Grid item xs={6}>
                  <TextInput name="address.zip" label="Zip" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ActionButtons />
    </TitledPaper>
  );
};

export default AuditionDetailsEdit;
