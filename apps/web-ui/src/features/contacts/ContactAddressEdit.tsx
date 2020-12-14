import { AddressType, ContactAddress } from '@makeit/types';
import {
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { FastField } from 'formik';
import { CheckboxWithLabel, Select, TextField } from 'formik-material-ui';
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
  deleteIcon: {
    flexGrow: 1,
    textAlign: 'right',
  },
}));

export const ContactAddressEdit = (props: {
  address: ContactAddress;
  prefix: string;
  onDelete: () => void;
}) => {
  const { address, prefix, onDelete } = props;
  const classes = useStyles();

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Grid container direction="row" spacing={1}>
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
                {Converter.enumToMenuItems('AddressType', AddressType)}
              </FastField>
            </FormControl>
          </Grid>
          {onDelete && (
            <Grid item className={classes.deleteIcon}>
              <Tooltip title="Delete Address">
                <IconButton onClick={onDelete}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item>
        <FastField
          component={TextField}
          name={prefix + '.address.line1'}
          label="Address Line 1"
          fullWidth={true}
        />
      </Grid>
      <Grid item>
        <FastField
          component={TextField}
          name={prefix + '.address.line2'}
          label="Line 2"
          fullWidth={true}
        />
      </Grid>
      <Grid item>
        <FastField
          component={TextField}
          name={prefix + '.address.line3'}
          label="Line 3"
          fullWidth={true}
        />
      </Grid>
      <Grid item>
        <FastField
          component={TextField}
          name={prefix + '.address.city'}
          label="City"
          fullWidth={true}
        />
      </Grid>
      <Grid item>
        <Grid container spacing={2}>
          <Grid item>
            <FastField
              component={TextField}
              name={prefix + '.address.state'}
              label="State"
              fullWidth={true}
            />
          </Grid>
          <Grid item>
            <FastField
              component={TextField}
              name={prefix + '.address.zip'}
              label="Zip"
              fullWidth={true}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <FastField
          component={CheckboxWithLabel}
          name={prefix + '.mailingAddress'}
          type="checkbox"
          Label={{ label: 'Mailing Address' }}
        />
      </Grid>
    </Grid>
  );
};

export default ContactAddressEdit;
