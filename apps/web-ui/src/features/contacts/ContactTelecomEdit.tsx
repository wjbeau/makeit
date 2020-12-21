import { Telecom, TelecomType } from '@makeit/types';
import {
  FormControl,
  Grid,
  makeStyles,
} from '@material-ui/core';
import { FastField } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { Converter } from '../../app/Converters';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(1),
  },
  label: {
    marginRight: theme.spacing(1),
    width: '15ch',
  },
}));

export const ContactTelecomEdit = (props: {
  telecom: Telecom;
  prefix: string;
}) => {
  const { telecom, prefix } = props;
  const classes = useStyles();
  return (
    <Grid container spacing={1} direction="row" wrap="nowrap">
      <Grid item>
        <FormControl>
          <FastField
            component={Select}
            name={prefix + '.type'}
            inputProps={{
              id: prefix + '.type',
              className: classes.label,
            }}
          >
            {Converter.enumToMenuItems('TelecomType', TelecomType)}
          </FastField>
        </FormControl>
      </Grid>
      <Grid item>
        <FastField component={TextField} name={prefix + '.details'} />
      </Grid>
    </Grid>
  );
};

export default ContactTelecomEdit;
