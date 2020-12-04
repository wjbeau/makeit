import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Switch } from '@material-ui/core';

const MuiSwitch = (props) => {
  const { label, name } = props;
  return (
    <FormControlLabel
      control={<Switch name={name} {...props} />}
      label={label}
    />
  );
};

function SwitchInput(props) {
  const { control } = useFormContext();
  const { name, label } = props;
  return (
    <Controller
      as={MuiSwitch}
      name={name}
      control={control}
      defaultValue={false}
      label={label}
      {...props}
    />
  );
}

export default SwitchInput;
