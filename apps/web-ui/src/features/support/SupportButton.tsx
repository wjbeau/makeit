import {
  Button,
  makeStyles,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from '@material-ui/core';
import { CancelOutlined, Send } from '@material-ui/icons';
import emailjs from 'emailjs-com';
import { FastField, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { useAppDispatch } from '../../app/store';
import { selectAuthed } from '../auth/auth.slice';
import { logError, logSuccess } from '../logging/logging.slice';
import { NX_WEB_UI_EMAILJS_TEMPLATEID, NX_WEB_UI_EMAILJS_USERID } from '../../app/config';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    right: -45,
    top: 'calc(50% - 10px)',
    transform: 'rotate(-90deg)',
    zIndex: 1200,
  },
  tab: {
    position: 'relative',
    right: -45,
    top: 'calc(50% - 10px)',
    transform: 'rotate(-90deg)',
    zIndex: 1200,
  },
  menuIcon: {
    marginRight: theme.spacing(2),
  },
  form: {
    zIndex: 1200,
    position: 'fixed',
    right: 0,
    top: 'calc(50% - 40px)',
  },
}));

export const SupportButton = () => {
  const classes = useStyles();
  const [visible, setVisible] = useState<boolean>(false);
  const authed = useSelector(selectAuthed);
  const [formValues, setFormValues] = useState({
    subject: '',
    message: '',
  });
  const dispatch = useAppDispatch();

  const handleSubmit = (
    values,
    { setSubmitting, setErrors, setStatus, resetForm }
  ) => {
    emailjs
      .send(
        'default_service',
        NX_WEB_UI_EMAILJS_TEMPLATEID,
        {
          reply_to: authed.email,
          from_name: authed.firstName + ' ' + authed.lastName,
          ...values,
        },
        NX_WEB_UI_EMAILJS_USERID
      )
      .then((res) => {
        resetForm()
        if (res.status === 200) {
          dispatch(logSuccess({ message: 'Thanks for your feedback!' }));
        }
        setVisible(false);
      })
      .catch((err) => dispatch(logError({ message: err.text})));
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const validationSchema = yup.object().shape({
    subject: yup.string().required('Required'),
    message: yup.string().required('Required'),
  });

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        className={classes.root}
        onClick={() => setVisible(!visible)}
      >
        Contact Us
      </Button>

      <Formik
        initialValues={formValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        validationSchema={validationSchema}
      >
        {({ dirty, values, submitForm, isSubmitting }) => (
          <Dialog open={visible} onClose={() => setVisible(false)}>
            <DialogTitle>How Can We Help?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Any feedback on functionality, ideas for features or bug reports
                are greatly appreciated!
              </DialogContentText>
              <Form>
                <FastField
                  component={TextField}
                  name="subject"
                  label="Subject"
                  fullWidth={true}
                  required
                  autoFocus
                />
                <FastField
                  component={TextField}
                  name="message"
                  label="Message"
                  multiline
                  fullWidth={true}
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
                onClick={handleCancel}
                startIcon={<CancelOutlined />}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Formik>
    </>
  );
};

export default SupportButton;
