import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardDatePicker } from '@material-ui/pickers';

const MuiDatePicker = (props) => {
  const { name, required, errors } = props;
  let isError = false;
  let errorMessage = '';
  if (errors && Object.prototype.hasOwnProperty.call(errors, name)) {
    isError = true;
    errorMessage = errors[name].message;
  }
  return (
    <KeyboardDatePicker
      format="DD-MM-YYYY"
      fullWidth={true}
      InputLabelProps={{
        className: required ? 'required-label' : '',
        required: required || false,
      }}
      error={isError}
      helperText={errorMessage}
      {...props}
    />
  );
};

function DatePickerInput(props) {
  const { control } = useFormContext();
  const { name, label } = props;

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Controller
        as={MuiDatePicker}
        name={name}
        control={control}
        label={label}
        defaultValue={null}
        {...props}
      />
    </MuiPickersUtilsProvider>
  );
}

export default DatePickerInput;
