import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { FastField, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useAppDispatch } from '../../app/store';
import * as yup from 'yup';
import { TextField } from 'formik-material-ui';
import { CancelOutlined, Send } from '@material-ui/icons';
import { changePassword } from './user.slice';
import { selectAuthed } from '../auth/auth.slice';
import { useSelector } from 'react-redux';
import { logError, logSuccess } from '../logging/logging.slice';
import { unwrapResult } from '@reduxjs/toolkit';
import { InputAdornment } from '@material-ui/core';
import { PasswordInputWithStrength } from './PasswordInputWithStrength';

export const useStyles = makeStyles((theme) => ({
  mainContent: {
    overflow: 'hidden',
  },
}));

export const ChangePasswordDialog = (props: { visible: boolean, onSave: () => void, onCancel: () => void}) => {
  const classes = useStyles();
  const authed = useSelector(selectAuthed);
  const {visible, onSave, onCancel } = props

  const dispatch = useAppDispatch();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    dispatch(
      changePassword({
        oldPassword: values.oldpwd,
        newPassword: values.newpwd,
        userid: authed._id,
      })
    )
      .then(unwrapResult)
      .then((d) => {
        resetForm();
        dispatch(logSuccess({ message: 'Password changed.' }));
        onSave();
      })
      .catch((err) => {
        dispatch(logError(err));
        setSubmitting(false);
      });
  };

  const handleCancel = (resetForm) => {
    resetForm();
    onCancel()
  };

  const validationSchema = yup.object().shape({
    oldpwd: yup.string().required('Required'),
    newpwd: yup.string().required('Required'),
    confirmpwd: yup
      .string()
      .required('Required')
      .oneOf([yup.ref('newpwd')], 'Passwords do not match'),
  });

  return (
    <Formik
      initialValues={{
        oldpwd: '',
        newpwd: '',
        confirmpwd: '',
      }}
      onSubmit={handleSubmit}
      enableReinitialize={true}
      validationSchema={validationSchema}
    >
      {({ values, submitForm, resetForm }) => (
        <Dialog open={visible}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your old password followed by your new password and
              confirm the new one.
            </DialogContentText>
            <Form>
              <Field
                component={TextField}
                name="oldpwd"
                label="Current Password"
                fullWidth={true}
                required
                autoFocus
                type="password"
              />
              <Field
                component={PasswordInputWithStrength}
                name="newpwd"
                label="New Password"
                fullWidth={true}
                required
              />
              <Field
                component={TextField}
                name="confirmpwd"
                label="Confirm Password"
                fullWidth={true}
                required
                type="password"
              />
            </Form>
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              color="primary"
              startIcon={<Send />}
              onClick={submitForm}
            >
              Send
            </Button>
            <Button
              variant="text"
              color="default"
              onClick={() => handleCancel(resetForm)}
              startIcon={<CancelOutlined />}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
};

export default ChangePasswordDialog;
