import { Audition, AuditionStatus, AuditionType } from '@makeit/types';
import { FormControl, Grid, InputLabel, makeStyles } from '@material-ui/core';
import { FastField } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import {
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from 'formik-material-ui-pickers';
import React from 'react';
import { Converter } from '../../app/Converters';
import TitledPaper from '../layout/TitledPaper';
import AttachmentPanel from '../attachments/AttachmentPanel';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    position: 'relative',
  },
}));

const AuditionDetailsEdit = (props: { audition: Audition }) => {
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
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="type">Type</InputLabel>
                <FastField
                  component={Select}
                  name="type"
                  inputProps={{
                    id: 'type',
                  }}
                >
                  {Converter.enumToMenuItems('AuditionType', AuditionType)}
                </FastField>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FastField
                component={KeyboardDateTimePicker}
                format="MM/DD/YYYY hh:mm a"
                name="auditionTime"
                label="Date / Time"
                fullWidth={true}
                initialFocusedDate={null}
              />
            </Grid>
            <Grid item xs={3}>
              <FastField
                component={KeyboardDateTimePicker}
                format="MM/DD/YYYY hh:mm a"
                name="deadline"
                label="Deadline"
                fullWidth={true}
                initialFocusedDate={null}
              />
            </Grid>
            <Grid item xs={2}>
              <FastField
                component={KeyboardDatePicker}
                format="MM/DD/YYYY"
                name="callbackDate"
                label="Callback Date"
                fullWidth={true}
                initialFocusedDate={null}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="status">Status</InputLabel>
                <FastField
                  component={Select}
                  name="status"
                  inputProps={{
                    id: 'status',
                  }}
                >
                  {Converter.enumToMenuItems('AuditionStatus', AuditionStatus)}
                </FastField>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <FastField
            component={TextField}
            name="instructions"
            label="Instructions"
            multiline
            fullWidth={true}
          />
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={3}>
              <FastField
                component={TextField}
                name="address.line1"
                label="Address Line 1"
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={3}>
              <FastField
                component={TextField}
                name="address.line2"
                label="Line 2"
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={3}>
              <FastField
                component={TextField}
                name="address.city"
                label="City"
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={3}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FastField
                    component={TextField}
                    name="address.state"
                    label="State"
                    fullWidth={true}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FastField
                    component={TextField}
                    name="address.zip"
                    label="Zip"
                    fullWidth={true}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AttachmentPanel container={props.audition} />
    </TitledPaper>
  );
};

export default AuditionDetailsEdit;
