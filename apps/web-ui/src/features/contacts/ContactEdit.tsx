import {
  Contact,
  ContactLinkType,
  ModelFactory,
  TelecomType
} from '@makeit/types';
import {
  Button,




  Grid,
  IconButton,
  makeStyles
} from '@material-ui/core';
import {
  Add,

  CancelOutlined,
  Delete,
  SaveOutlined
} from '@material-ui/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { FastField, FieldArray, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch } from '../../app/store';
import EditableAvatar from '../controls/EditableAvatar';
import TitledSection from '../layout/TitledSection';
import { logError, logSuccess } from '../logging/logging.slice';
import { saveContact } from './contact.slice';
import ContactAddressEdit from './ContactAddressEdit';
import ContactLinkEdit from './ContactLinkEdit';
import ContactTelecomEdit from './ContactTelecomEdit';

const useStyles = makeStyles((theme) => ({
  mainAvatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginRight: theme.spacing(2),
  },
  headingAvatar: {
    flexGrow: 0,
  },
  headingTitles: {
    flexGrow: 1,
  },
  headingTitleMain: {},
  headingTitleSecondary: {},
  headingTitleTertiary: {},
  headingActions: {
    flexGrow: 0,
  },
  address: {
    minWidth: 200,
  },
}));

export const ContactEdit = (props: {
  contact: Contact;
  onCancel: () => void;
  onSave: (contact: Contact) => void;
}) => {
  const { contact, onCancel, onSave } = props;
  const classes = useStyles();
  const [formValues, setFormValues] = useState<Contact>(contact);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleSave = (values, { setSubmitting }) => {
    dispatch(saveContact(values))
      .then(unwrapResult)
      .then((d) => {
        dispatch(logSuccess({ message: 'Saved successfully.' }));
        onSave(d);
      })
      .catch((error) => {
        dispatch(logError(error));
        setSubmitting(false);
      });
  };

  const handleContactAdd = (arrayHelpers) => {
    arrayHelpers.push({
      type: TelecomType.PersonalEmail,
      details: '',
    });
  };
  const handleLinkAdd = (arrayHelpers) => {
    arrayHelpers.push({
      type: ContactLinkType.PersonalWebsite,
      url: '',
    });
  };
  const handleAddressAdd = (arrayHelpers) => {
    arrayHelpers.push(ModelFactory.createEmptyAddress());
  };

  useEffect(() => {
    setFormValues(contact);
  }, [contact]);

  const validationSchema = yup.object().shape({
    lastName: yup.string().test("hasName", 'Either Last Name or Organization Required', function(value) {
      const { company } = this.parent;
      const valid = (value && value.length > 0) || (company && company.length > 0);
      return valid;
    }),
    company: yup.string().test("hasName", 'Either Last Name or Organization Required', function(value) {
      const { lastName } = this.parent;
      const valid = (value && value.length > 0) || (lastName && lastName.length > 0);
      return valid;
    }),
    telecoms: yup.array(
      yup.object().shape({
        type: yup.string().required('Required'),
        details: yup.string().required('Required'),
      })
    ),
    links: yup.array(
      yup.object().shape({
        type: yup.string().required('Required'),
        url: yup
          .string()
          .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'Please enter a valid URL'
          ),
      })
    ),
    addresses: yup.array(
      yup.object().shape({
        type: yup.string().required('Required'),
      })
    ),
  });

  return (
    <Formik
      initialValues={formValues}
      onSubmit={handleSave}
      enableReinitialize={true}
      validationSchema={validationSchema}
    >
      {({ dirty, values, submitForm, isSubmitting, setFieldValue }) => (
        <Form>
          <Grid container spacing={3} direction="row">
            <Grid item xs={12}>
              <Grid container spacing={1} direction="row">
                <Grid item className={classes.headingAvatar}>
                  <EditableAvatar person={values} onChange={(preview) => {
                      setFieldValue('avatar', preview);
                    }} />
                </Grid>
                <Grid item className={classes.headingTitles}>
                  <Grid container spacing={1} direction="row">
                    <Grid item>
                      <FastField
                        component={TextField}
                        name="firstName"
                        label="First Name"
                      />
                    </Grid>
                    <Grid item>
                      <FastField
                        component={TextField}
                        name="lastName"
                        label="Last Name"
                      />
                    </Grid>
                  </Grid>
                  <FastField
                    component={TextField}
                    name="jobTitle"
                    label="Title"
                    fullWidth={true}
                  />
                  <FastField
                    component={TextField}
                    name="company"
                    label="Organization"
                    fullWidth={true}
                  />
                  <FastField
                    component={TextField}
                    name="description"
                    label="Description"
                    fullWidth={true}
                  />
                </Grid>
                <Grid item className={classes.headingActions}>
                  <div>
                    <Button
                      onClick={submitForm}
                      color="primary"
                      startIcon={<SaveOutlined />}
                      disabled={!dirty && !isSubmitting}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={onCancel}
                      color="primary"
                      startIcon={<CancelOutlined />}
                    >
                      Cancel
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TitledSection title="Contacts">
                <FieldArray
                  name="telecoms"
                  render={(arrayHelpers) => (
                    <>
                      {values &&
                        values.telecoms &&
                        values.telecoms.map((t, index) => (
                          <Grid
                            container
                            spacing={1}
                            direction="row"
                            key={`telecoms[${index}]`}
                            wrap="nowrap"
                            alignItems="center"
                          >
                            <Grid item>
                              <ContactTelecomEdit
                                prefix={`telecoms[${index}]`}
                                telecom={t}
                              />
                            </Grid>
                            <Grid item>
                              <IconButton
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <Delete />
                              </IconButton>
                            </Grid>
                          </Grid>
                        ))}
                      <div>
                        <Button
                          color="primary"
                          startIcon={<Add />}
                          onClick={() => handleContactAdd(arrayHelpers)}
                        >
                          Add Contact
                        </Button>
                      </div>
                    </>
                  )}
                />
              </TitledSection>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TitledSection title="Links">
                <FieldArray
                  name="links"
                  render={(arrayHelpers) => (
                    <>
                      {values &&
                        values.links &&
                        values.links.map((t, index) => (
                          <Grid
                            container
                            spacing={1}
                            direction="row"
                            key={`links[${index}]`}
                            wrap="nowrap"
                            alignItems="center"
                          >
                            <Grid item>
                              <ContactLinkEdit
                                prefix={`links[${index}]`}
                                link={t}
                              />
                            </Grid>
                            <Grid item>
                              <IconButton
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <Delete />
                              </IconButton>
                            </Grid>
                          </Grid>
                        ))}
                      <div>
                        <Button
                          color="primary"
                          startIcon={<Add />}
                          onClick={() => handleLinkAdd(arrayHelpers)}
                        >
                          Add Link
                        </Button>
                      </div>
                    </>
                  )}
                />
              </TitledSection>
            </Grid>
            <Grid item xs={12}>
              <TitledSection title="Addresses">
                <FieldArray
                  name="addresses"
                  render={(arrayHelpers) => (
                    <Grid container spacing={3} direction="row">
                      {values &&
                        values.addresses &&
                        values.addresses.map((t, index) => (
                          <Grid item xs={6} key={`addresses[${index}]`}>
                            <ContactAddressEdit
                              prefix={`addresses[${index}]`}
                              address={t}
                              onDelete={() => arrayHelpers.remove(index)}
                            />
                          </Grid>
                        ))}
                      <Grid item xs={12}>
                        <Button
                          color="primary"
                          startIcon={<Add />}
                          onClick={() => handleAddressAdd(arrayHelpers)}
                        >
                          Add Address
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                />
              </TitledSection>
            </Grid>
            <Grid item xs={12}>
              <TitledSection title="Notes">
                <FastField
                  component={TextField}
                  name="note"
                  multiline
                  fullWidth={true}
                />
              </TitledSection>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ContactEdit;
