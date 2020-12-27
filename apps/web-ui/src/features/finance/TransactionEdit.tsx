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
import { Form, Formik, FastField, Field } from 'formik';
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
import { TransactionExpenseCategory, TransactionRelationType } from '../../../../../libs/types/src/finance.model';

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
  const { inputRef, onChange, ...other } = props;
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
};

const TransactionEdit = (props: { onSave?: (t: Transaction) => void, onCancel?: () => void, related?, relatedType?:TransactionRelationType, stacked?:boolean }) => {
  const classes = useStyles();
  const { onSave, related, relatedType, stacked, onCancel } = props;
  const [formValues, setFormValues] = useState<Transaction>(
    ModelFactory.createEmptyTransaction(
      TransactionType.Income,
      TransactionIncomeCategory.Salary,
      related,
      relatedType
    )
  );
  const dispatch = useAppDispatch();

  const handleSave = (values, { setSubmitting, resetForm }) => {
    dispatch(saveTransaction(values))
      .then(unwrapResult)
      .then((p) => {
        const replacement = ModelFactory.createEmptyTransaction(
          TransactionType.Income,
          TransactionIncomeCategory.Salary
        )
        replacement.type = p.type;
        replacement.category = p.category;
        replacement.date = p.date;
        resetForm(replacement);
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
        TransactionType.Income,
        TransactionIncomeCategory.Salary
      )
    );
    setSubmitting(false);
    if(onCancel) {
      onCancel();
    }
  };

  const validationSchema = yup.object().shape({
    type: yup.string().required('Required'),
    amount: yup
      .number()
      .required('Required')
      .min(0, 'Please enter positive amount.'),
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
              <Grid item xs={stacked ? 12 : 6} md={stacked ? 6 : 3}>
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="transact-type">Type</InputLabel>
                  <Field
                    component={Select}
                    name="type"
                    inputProps={{
                      id: 'transact-type',
                    }}
                    fullWidth={true}
                  >
                    {Converter.enumToMenuItems(
                      'TransactionType',
                      TransactionType
                    )}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={stacked ? 12 : 6} md={stacked ? 6 : 3}>
                <FastField
                  component={KeyboardDatePicker}
                  initialFocusedDate={null}
                  format="MM/DD/YYYY"
                  name="date"
                  label="Date"
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={stacked ? 12 : 6} md={stacked ? 6 : 3}>
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="transact-category">Category</InputLabel>
                  <Field
                    component={Select}
                    name="category"
                    inputProps={{
                      id: 'transact-category',
                    }}
                    fullWidth={true}
                  >
                    {values.type === TransactionType.Expense
                      ? Converter.enumToMenuItems(
                          'TransactionExpenseCategory',
                          TransactionExpenseCategory
                        )
                      : Converter.enumToMenuItems(
                          'TransactionIncomeCategory',
                          TransactionIncomeCategory
                        )}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={stacked ? 12 : 6} md={stacked ? 6 : 3}>
                <FastField
                  component={TextField}
                  name="amount"
                  label="Amount"
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
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

export default TransactionEdit;
