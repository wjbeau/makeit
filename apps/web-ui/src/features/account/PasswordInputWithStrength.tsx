import { InputAdornment, makeStyles, TextField } from '@material-ui/core';
import { fieldToTextField, TextFieldProps } from 'formik-material-ui';
import React, { useState } from 'react';
import * as zxcvbn from 'zxcvbn';

const useStyles = makeStyles((theme) => ({
  weak: {
    color: theme.palette.error.dark,
  },
  fair: {
    color: theme.palette.warning.dark,
  },
  good: {
    color: theme.palette.info.dark,
  },
  strong: {
    color: theme.palette.success.dark,
  },
}));

export const PasswordInputWithStrength = (props: TextFieldProps) => {
  const classes = useStyles();
  const [strength, setStrength] = useState(<span></span>);

  const {
    form: { setFieldValue },
    field: { name },
  } = props;

  const onChange = React.useCallback(
    (event) => {
      const { value } = event.target;
      if (value) {
        const result = zxcvbn(value);
        switch (result.score) {
          case 0:
          case 1:
            setStrength(<span className={classes.weak}>Weak</span>);
            break;
          case 2:
            setStrength(<span className={classes.fair}>Fair</span>);
            break;
          case 3:
            setStrength(<span className={classes.good}>Good</span>);
            break;
          case 4:
            setStrength(<span className={classes.strong}>Strong</span>);
            break;
        }
      } else {
        setStrength(<span></span>);
      }
      setFieldValue(name, value);
    },
    [
      setFieldValue,
      name,
      classes.weak,
      classes.fair,
      classes.good,
      classes.strong,
    ]
  );

  return (
    <TextField
      {...fieldToTextField(props)}
      onChange={onChange}
      type="password"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">{strength}</InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordInputWithStrength;
