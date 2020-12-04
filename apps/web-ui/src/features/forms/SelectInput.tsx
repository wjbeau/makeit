import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { FormHelperText } from '@material-ui/core';

const MuiSelect = (props) => {
  const { label, name, options, required,  errors } = props;

  let isError = false;
  let errorMessage = '';
  if (errors && Object.prototype.hasOwnProperty.call(errors, name)) {
    isError = true;
    errorMessage = errors[name].message;
  }

  return (
    <FormControl fullWidth={true} error={isError}>
      <InputLabel htmlFor={name}>{label} {required ? <span className="required-label">*</span> : null}</InputLabel>
      <Select id={name} {...props}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
};

const SelectInput = (props) => {
  const { control } = useFormContext();
  const { name, label } = props;

  return (
    <Controller
      as={MuiSelect}
      control={control}
      name={name}
      label={label}
      defaultValue=""
      {...props}
    />
  );
}

export default SelectInput;
