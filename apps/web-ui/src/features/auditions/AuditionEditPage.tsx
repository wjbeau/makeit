import { yupResolver } from '@hookform/resolvers/yup';
import {
  Audition,
  AuditionStatus,
  Gender,
  AuditionType,
  ProjectType,
  UnionType,
} from '@makeit/types';
import {
  Breadcrumbs,
  Button,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ArrowBack, CancelOutlined, SaveAltOutlined } from '@material-ui/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { Converter } from '../../app/converters';
import { useAppDispatch } from '../../app/store';
import DatePickerInput from '../forms/DatePickerInput';
import DateTimePickerInput from '../forms/DatePickerTimeInput';
import SelectInput from '../forms/SelectInput';
import TextInput from '../forms/TextInput';
import Loading from '../layout/Loading';
import TitledPaper from '../layout/TitledPaper';
import { logError, logSuccess } from '../logging/logging.slice';
import { Ethnicity } from '../../../../../libs/types/src/base-enums.model';
import AddAttachmentLinks from './AddAttachmentLinks';
import {
  saveAudition,
  selectAuditions,
  selectAuditionsLoading,
} from './audition.slice';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    position: 'relative',
  },
}));

const validationSchema = yup.object().shape({});

const AuditionEditPage = () => {
  const classes = useStyles();
  const { auditionId } = useParams<{ auditionId: string }>();
  const [audition, setAudition] = useState<Audition>();
  const loading = useSelector(selectAuditionsLoading);
  const auditions = useSelector(selectAuditions);
  const history = useHistory();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });
  const dispatch = useAppDispatch();

  const { handleSubmit, errors, reset } = methods;

  const handleSave = (data) => {
    setAudition({ ...audition, ...data });
    dispatch(saveAudition(data))
      .then(unwrapResult)
      .then((p) => {
        dispatch(logSuccess('Save completed successfully.'));
        history.push('/auditions');
      })
      .catch((e) => {
        dispatch(logError(e));
        reset(data);
      });
  };
  const handleCancel = (data) => {
    history.goBack();
  };

  const title = auditionId === 'new' ? 'New Audition' : 'Edit Audition';

  useEffect(() => {
    if (auditionId !== 'new') {
      setAudition(auditions.find((a) => a.id === auditionId));
      reset(audition);
    }
  }, [auditionId, setAudition, auditions, audition, reset]);

  return (
    <div>
      {loading && <Loading />}
      {!loading && (
        <FormProvider {...methods}>
          <form>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Breadcrumbs>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleCancel}
                    startIcon={<ArrowBack />}
                  >
                    Back to Auditions
                  </Button>
                </Breadcrumbs>
              </Grid>
              <Grid item>
                <Typography variant="h4" component="h1">
                  {title}
                </Typography>
              </Grid>
              <Grid item>
                <TitledPaper
                  variant="h6"
                  component="h2"
                  className={classes.attachmentContainer}
                  title="Audition Details"
                >
                  <AddAttachmentLinks />
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Grid container direction="row" spacing={2}>
                        <Grid item xs={2}>
                          <SelectInput
                            name="type"
                            label="Type"
                            options={Converter.enumToOptions(AuditionType)}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <DateTimePickerInput
                            name="auditionTime"
                            label="Date / Time"
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <DateTimePickerInput
                            name="deadline"
                            label="Deadline"
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <DatePickerInput
                            name="callbackDate"
                            label="Callback Date"
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <SelectInput
                            name="status"
                            label="Status"
                            options={Converter.enumToOptions(AuditionStatus)}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <TextInput
                        name="instructions"
                        label="Instructions"
                        multiline
                      />
                    </Grid>
                    <Grid item>
                      <Grid container direction="row" spacing={2}>
                        <Grid item xs={3}>
                          <TextInput name="address.line1" label="Address Line 1" />
                        </Grid>
                        <Grid item xs={3}>
                          <TextInput name="address.line2" label="Line 2" />
                        </Grid>
                        <Grid item xs={3}>
                          <TextInput name="address.city" label="City" />
                        </Grid>
                        <Grid item xs={3}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextInput name="address.state" label="State" />
                            </Grid>
                            <Grid item xs={6}>
                              <TextInput name="address.zip" label="Zip" />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </TitledPaper>
              </Grid>
              <Grid item>
                <Grid container direction="row" spacing={3}>
                  <Grid item xs={6}>
                    <TitledPaper
                      variant="h6"
                      component="h2"
                      className={classes.attachmentContainer}
                      title="Role/Breakdown Details"
                    >
                      <AddAttachmentLinks />
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <Grid container direction="row" spacing={2}>
                            <Grid item xs={6}>
                              <TextInput
                                name="breakdown.roleName"
                                label="Role Name"
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <TextInput
                                name="breakdown.roleType"
                                label="Type"
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <TextInput
                                name="breakdown.rate"
                                label="Rate / Pay"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <TextInput
                            name="breakdown.roleDescription"
                            label="Description"
                            multiline
                          />
                        </Grid>
                        <Grid item>
                          <Grid container direction="row" spacing={2}>
                            <Grid item xs={3}>
                              <SelectInput
                                name="breakdown.gender"
                                label="Gender"
                                options={Converter.enumToOptions(Gender)}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <TextInput
                                name="breakdown.ageMin"
                                label="Age (from)"
                                type="number"
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <TextInput
                                name="breakdown.ageMax"
                                label="Age (to)"
                                type="number"
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <SelectInput
                                name="breakdown.ethnicities"
                                label="Ethnicities"
                                options={Converter.enumToOptions(Ethnicity)}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </TitledPaper>
                  </Grid>
                  <Grid item xs={6}>
                    <TitledPaper
                      variant="h6"
                      component="h2"
                      className={classes.attachmentContainer}
                      title="Role/Breakdown Details"
                    >
                      <AddAttachmentLinks />
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <TextInput
                            name="breakdown.project.name"
                            label="Project Name"
                          />
                        </Grid>
                        <Grid item>
                          <Grid container direction="row" spacing={2}>
                            <Grid item xs={4}>
                              <SelectInput
                                name="breakdown.project.type"
                                label="Project Type"
                                options={Converter.enumToOptions(ProjectType)}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <DatePickerInput
                                name="breakdown.project.startDate"
                                label="Start Date"
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <SelectInput
                                name="breakdown.project.union"
                                label="Union Status"
                                options={Converter.enumToOptions(UnionType)}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <TextInput
                            name="breakdown.project.description"
                            label="Description"
                            multiline
                          />
                        </Grid>
                      </Grid>
                    </TitledPaper>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <TitledPaper
                  variant="h6"
                  component="h2"
                  className={classes.attachmentContainer}
                  title="Notes"
                >
                  <AddAttachmentLinks />
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <TextInput name="auditionNotes" label="Notes" multiline />
                    </Grid>
                  </Grid>
                </TitledPaper>
              </Grid>
              <Grid item>
                <TitledPaper variant="h6" component="h2" title="Set Reminder">
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs={3}>
                      <DateTimePickerInput name="reminderDate" label="Date" />
                    </Grid>
                    <Grid item xs={9}>
                      <TextInput
                        name="reminderDescription"
                        label="Description"
                        multiline
                      />
                    </Grid>
                  </Grid>
                </TitledPaper>
              </Grid>
              <Grid item>
                <Grid container spacing={2} direction="row">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit(handleSave)}
                      startIcon={<SaveAltOutlined />}
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="default"
                      onClick={handleCancel}
                      startIcon={<CancelOutlined />}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default AuditionEditPage;
