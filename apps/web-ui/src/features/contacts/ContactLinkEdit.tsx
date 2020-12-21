import {
  FormControl,
  Grid,
  makeStyles,
} from '@material-ui/core';
import { FastField } from 'formik';
import React from 'react';
import { Converter } from '../../app/Converters';
import { ContactLink, ContactLinkType } from '@makeit/types';
import { Select, TextField } from 'formik-material-ui';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(1),
  },
  label: {
    marginRight: theme.spacing(1),
    width: '15ch',
  },
}));

export const ContactLinkEdit = (props: {
  link: ContactLink;
  prefix: string;
}) => {
  const { link, prefix } = props;
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
            {Converter.enumToMenuItems('ContactLinkType', ContactLinkType)}
          </FastField>
        </FormControl>
      </Grid>
      <Grid item>
        <FastField component={TextField} name={prefix + '.url'} />
      </Grid>
    </Grid>
  );
};

export default ContactLinkEdit;
