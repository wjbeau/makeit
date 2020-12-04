import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import TextField from "@material-ui/core/TextField";

function TextInput(props) {
  const { control } = useFormContext();
  const { name, label, required, errors } = props;
  
  let isError = false;
  let errorMessage = "";
  if (errors && Object.prototype.hasOwnProperty.call(errors, name)) {
    isError = true;
    errorMessage = errors[name].message;
  }

  return (
    <Controller
      as={TextField}
      name={name}
      control={control}
      defaultValue=""
      label={label}
      fullWidth={true}
      InputLabelProps={{
        className: required ? "required-label" : "",
        required: required || false,
      }}
      error={isError}
      helperText={errorMessage}
      {...props}
    />
  );
}

export default TextInput;