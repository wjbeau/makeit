import {
  AddressType, Contact,
  ContactLinkType, ContactUtils,
  ModelFactory,
  TelecomType
} from '@makeit/types';
import {
  Avatar,
  Button, Grid,
  IconButton,
  makeStyles,
  TextField, Typography
} from '@material-ui/core';
import {
  Add,
  CancelOutlined, Delete, Facebook,
  Instagram,
  LinkedIn,
  Pinterest,
  SaveOutlined, Twitter,
  YouTube
} from '@material-ui/icons';
import { mdiVimeo as Vimeo } from '@mdi/js';
import { FastField, FieldArray, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { Converter } from '../../app/Converters';
import { useAppDispatch } from '../../app/store';
import AddressDisplay from '../controls/AddressDisplay';
import ImdbIcon from '../controls/icons/ImdbIcon';
import TitledSection from '../layout/TitledSection';
import ContactTelecomEdit from './ContactTelecomEdit';
import ContactAddressEdit from './ContactAddressEdit';

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

const iconForSocial = (val: ContactLinkType) => {
  switch (val) {
    case ContactLinkType.Facebook:
      return <Facebook />;
    case ContactLinkType.Instagram:
      return <Instagram />;
    case ContactLinkType.LinkedIn:
      return <LinkedIn />;
    case ContactLinkType.IMDb:
      return <ImdbIcon />;
    case ContactLinkType.YouTube:
      return <YouTube />;
    case ContactLinkType.Pintrest:
      return <Pinterest />;
    case ContactLinkType.Twitter:
      return <Twitter />;
    case ContactLinkType.Vimeo:
      return <Vimeo />;
  }
};

export const ContactEdit = (props: {
  contact: Contact;
  onCancel: () => void;
}) => {
  const { contact, onCancel } = props;
  const classes = useStyles();
  const socials = contact.links?.filter((l) =>
    ContactUtils.isSocialMedia(l.type)
  );
  const [formValues, setFormValues] = useState<Contact>(contact);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleSave = (values) => {
    //TODO do something here
  };

  const handleCancel = () => {
    history.goBack();
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
    console.log(contact);
    setFormValues(contact);
  }, [contact]);

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
  });

  return (
    <Formik
      initialValues={formValues}
      onSubmit={handleSave}
      enableReinitialize={true}
      validationSchema={validationSchema}>
      {({ dirty, values, submitForm, isSubmitting }) => (
        
        <Form>
          <Grid container spacing={3} direction="row">
            <Grid item xs={12}>
              <Grid container spacing={1} direction="row">
                <Grid item className={classes.headingAvatar}>
                  <Avatar src={values.avatar} className={classes.mainAvatar}>
                    {Converter.getInitials(values)}
                  </Avatar>
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
                    label="Company"
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
                        values.telecoms &&
                        values.telecoms.map((t, index) => (
                          <Grid
                            container
                            spacing={1}
                            direction="row"
                            key={`links[${index}]`}
                          >
                            <Grid item>
                              <ContactTelecomEdit
                                prefix={`links[${index}]`}
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
            <Grid item xs={12} sm={6}>
              <TitledSection title="Addresses">
                <FieldArray
                  name="addresses"
                  render={(arrayHelpers) => (
                    <>
                      {values &&
                        values.addresses &&
                        values.addresses.map((t, index) => (
                          <Grid
                            container
                            spacing={1}
                            direction="row"
                            key={`addresses[${index}]`}
                          >
                            <Grid item>
                              <ContactAddressEdit
                                prefix={`addresses[${index}]`}
                                address={t}
                                onDelete={() => arrayHelpers.remove(index)}
                              />
                            </Grid>
                          </Grid>
                        ))}
                      <div>
                        <Button
                          color="primary"
                          startIcon={<Add />}
                          onClick={() => handleAddressAdd(arrayHelpers)}
                        >
                          Add Address
                        </Button>
                      </div>
                    </>
                  )}
                />
              </TitledSection>
            </Grid>
            <Grid item xs={12} sm={6}>
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
