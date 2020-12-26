import DateFnsUtils from '@date-io/moment';
import {
  ModelFactory,
  TransactionType,
  Transaction,
  TransactionIncomeCategory,
} from '@makeit/types';
import { Button, Grid, InputAdornment, makeStyles } from '@material-ui/core';
import { CancelOutlined, SaveAltOutlined } from '@material-ui/icons';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik, FastField } from 'formik';
import React, { useState } from 'react';
import * as yup from 'yup';
import { useAppDispatch } from '../../app/store';
import { logError, logSuccess } from '../logging/logging.slice';
import { FormControl, InputLabel } from '@material-ui/core';
import { Select, TextField } from 'formik-material-ui';
import { Converter } from '../../app/Converters';
import { KeyboardDatePicker } from 'formik-material-ui-pickers';
import { saveTransaction } from './finance.slice';
import AttachmentPanel from '../attachments/AttachmentPanel';
import NumberFormat from 'react-number-format';
import { TransactionExpenseCategory } from '@makeit/types';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    position: 'relative',
  },
  addNoteContainer: {
    marginTop: theme.spacing(3),
  },
  unsaved: {
    color: theme.palette.grey[400],
    marginLeft: theme.spacing(1),
  },
  floatButtons: {
    float: 'right',
  },
  paddingLeft: {
    marginLeft: theme.spacing(1),
  },
}));


const NumberFormatCustom = (props) => {
  const {inputRef, onChange, ...other} = props
  return (
    <NumberFormat
      getInputRef={inputRef}
      {...other}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

const ExpenseEdit = (props: { onSave?: (t: Transaction) => void }) => {
  const classes = useStyles();
  const { onSave } = props;
  const [formValues, setFormValues] = useState<Transaction>(
    ModelFactory.createEmptyTransaction(
      TransactionType.Expense,
      TransactionExpenseCategory.Fuel
    )
  );
  const dispatch = useAppDispatch();

  const handleSave = (values, { setSubmitting, resetForm }) => {
    dispatch(saveTransaction(values))
      .then(unwrapResult)
      .then((p) => {
        resetForm(
          ModelFactory.createEmptyTransaction(
            TransactionType.Expense,
            TransactionExpenseCategory.Fuel
          )
        );
        setSubmitting(false);
        dispatch(logSuccess({ message: 'Save completed successfully.' }));
        if (onSave) {
          onSave(p);
        }
      })
      .catch((e) => {
        setFormValues(values);
        dispatch(logError(e));
      });
  };
  const handleCancel = (setSubmitting, reset) => {
    reset(
      ModelFactory.createEmptyTransaction(
        TransactionType.Expense,
        TransactionExpenseCategory.Fuel
      )
    );
    setSubmitting(false);
  };

  const validationSchema = yup.object().shape({
    type: yup.string().required('Required'),
    amount: yup.number().required('Required').min(0, "Please enter positive amount."),
    date: yup
          .date()
          .transform((curr, orig) => {
            return !orig || !orig.isValid || !orig.isValid() ? undefined : curr;
          })
          .required('Required'),
    category: yup.string().required('Required'),
  });

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Formik
        initialValues={formValues}
        onSubmit={handleSave}
        enableReinitialize={true}
        validationSchema={validationSchema}
      >
        {({
          dirty,
          values,
          submitForm,
          isSubmitting,
          setSubmitting,
          resetForm,
        }) => (
          <Form>
            <Grid container direction="row" spacing={3}>
              <Grid item xs={4}>
                <FastField
                  component={KeyboardDatePicker}
                  initialFocusedDate={null}
                  format="MM/DD/YYYY"
                  name="date"
                  label="Date"
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="transact-category">Category</InputLabel>
                  <FastField
                    component={Select}
                    name="category"
                    inputProps={{
                      id: 'transact-category',
                    }}
                    fullWidth={true}
                  >
                    {Converter.enumToMenuItems(
                      'TransactionExpenseCategory',
                      TransactionExpenseCategory
                    )}
                  </FastField>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FastField
                  component={TextField}
                  name="amount"
                  label="Amount"
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={12}>
                <FastField
                  component={TextField}
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid item xs={12}>
                <AttachmentPanel container={values} disableMargin>
                  <Button
                    variant="text"
                    color="default"
                    onClick={() => handleCancel(setSubmitting, resetForm)}
                    startIcon={<CancelOutlined />}
                    className={classes.floatButtons}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    startIcon={<SaveAltOutlined />}
                    disabled={isSubmitting || !dirty}
                    onClick={submitForm}
                    className={classes.floatButtons}
                  >
                    Save
                  </Button>
                </AttachmentPanel>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </MuiPickersUtilsProvider>
  );
};

export default ExpenseEdit;
