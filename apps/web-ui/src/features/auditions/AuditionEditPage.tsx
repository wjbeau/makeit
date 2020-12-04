import { yupResolver } from '@hookform/resolvers/yup';
import { Audition, AuditionStatus } from '@makeit/types';
import { Breadcrumbs, Button, Grid, Typography } from '@material-ui/core';
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
import SelectInput from '../forms/SelectInput';
import SwitchInput from '../forms/SwitchInput';
import TextInput from '../forms/TextInput';
import Loading from '../layout/Loading';
import TitledPaper from '../layout/TitledPaper';
import { logError } from '../logging/logging.slice';
import {
  saveAudition,
  selectAuditions,
  selectAuditionsLoading,
} from './audition.slice';

const validationSchema = yup.object().shape({});

const AuditionEditPage = () => {
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
      .then((p) => history.push('/auditions'))
      .catch((e) => dispatch(logError(e)));
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
                  title="Audition Details"
                >
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Grid container direction="row" spacing={2}>
                        <Grid item xs={2}>
                          <TextInput name="type" label="Type" />
                        </Grid>
                        <Grid item xs={2}>
                          <DatePickerInput
                            name="auditionTime"
                            label="Date / Time"
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <DatePickerInput
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
                      <TextInput name="instructions" label="Instructions" />
                    </Grid>
                    <Grid item xs={6}>
                      <TextInput name="address" label="Address" />
                    </Grid>
                    <Grid item>Add attachments here...</Grid>
                  </Grid>
                </TitledPaper>
              </Grid>
              <Grid item>
                <Grid container direction="row" spacing={3}>
                  <Grid item xs={6}>
                    <TitledPaper
                      variant="h6"
                      component="h2"
                      title="Role/Breakdown Details"
                    >
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <Grid container direction="row" spacing={2}>
                            <Grid item xs={6}>
                              <TextInput
                                name="breakdown.roleName"
                                label="Role Name"
                                required={true}
                                errors={errors}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <TextInput
                                name="breakdown.roleType"
                                label="Type"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <TextInput
                            name="breakdown.roleDescription"
                            label="Description"
                          />
                        </Grid>
                        <Grid item>
                          <Grid container direction="row" spacing={2}>
                            <Grid item xs={2}>
                              <TextInput
                                name="breakdown.rate"
                                label="Rate / Pay"
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <TextInput
                                name="breakdown.gender"
                                label="Gender"
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <TextInput
                                name="breakdown.ageMin"
                                label="Age (from)"
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <TextInput
                                name="breakdown.ageMax"
                                label="Age (to)"
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <TextInput
                                name="breakdown.ethnicities"
                                label="Ethnicities"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>Add attachments here...</Grid>
                      </Grid>
                    </TitledPaper>
                  </Grid>
                  <Grid item xs={6}>
                    <TitledPaper
                      variant="h6"
                      component="h2"
                      title="Project Details"
                    >
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <Grid container direction="row" spacing={2}>
                            <Grid item xs={6}>
                              <TextInput
                                name="breakdown.project.name"
                                label="Project Name"
                                required={true}
                                errors={errors}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <TextInput
                                name="breakdown.project.type"
                                label="Project Type"
                                required={true}
                                errors={errors}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <DatePickerInput
                                name="breakdown.project.startDate"
                                label="Start Date"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <TextInput
                            name="breakdown.project.description"
                            label="Description"
                          />
                        </Grid>
                        <Grid item>
                          <Grid container direction="row" spacing={2}>
                            <Grid item xs={3}>
                              <TextInput
                                name="breakdown.project.union"
                                label="Union Status"
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <TextInput
                                name="breakdown.project.unionContract"
                                label="Union Contract"
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <SwitchInput
                                name="breakdown.project.unionStatusPending"
                                label="Status Pending?"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>Add attachments here...</Grid>
                        <Grid item>Add links here...</Grid>
                        <Grid item>Add participants? here...</Grid>
                      </Grid>
                    </TitledPaper>
                  </Grid>
                </Grid>
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
