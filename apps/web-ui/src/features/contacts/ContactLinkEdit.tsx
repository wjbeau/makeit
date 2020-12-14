import { ContactUtils, Telecom, TelecomType } from '@makeit/types';
import {
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Select,
  TextField,
} from '@material-ui/core';
import { Call, Email, PermContactCalendar } from '@material-ui/icons';
import { FastField } from 'formik';
import React from 'react';
import { Converter } from '../../app/Converters';
import { ContactLink, ContactLinkType } from '../../../../../libs/types/src/contact.model';

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
    <Grid container spacing={1} direction="row">
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
