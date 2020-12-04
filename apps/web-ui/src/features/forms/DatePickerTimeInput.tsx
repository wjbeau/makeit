import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import MomentUtils from '@date-io/moment';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

const MuiDateTimePicker = (props) => {
  const { name, required, errors } = props;
  let isError = false;
  let errorMessage = '';
  if (errors && Object.prototype.hasOwnProperty.call(errors, name)) {
    isError = true;
    errorMessage = errors[name].message;
  }
  return (
    <KeyboardDateTimePicker
      format="DD-MM-YYYY hh:mm a"
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

function DateTimePickerInput(props) {
  const { control } = useFormContext();
  const { name, label } = props;

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Controller
        name={name}
        control={control}
        label={label}
        defaultValue={null}
        render={({ onChange, onBlur, value, name, ref }) => (
          <MuiDateTimePicker
            onBlur={onBlur}
            onChange={onChange}
            inputRef={ref}
            {...props}
          />
        )}
      />
    </MuiPickersUtilsProvider>
  );
}

export default DateTimePickerInput;
