import React, { useEffect, useState } from 'react';
import Loading from '../layout/Loading';
import { Breadcrumbs, Button, Grid, Typography } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import TextInput from '../forms/TextInput';

import * as yup from "yup";
import { FormProvider, useForm } from 'react-hook-form';
import TitledPaper from '../layout/TitledPaper';
import { ArrowBack, CancelOutlined, SaveAltOutlined } from '@material-ui/icons';
import { saveAudition, selectAuditions, selectAuditionsLoading } from './audition.slice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { unwrapResult } from '@reduxjs/toolkit';
import { logError } from '../logging/logging.slice';
import { Audition, AuditionStatus } from '@makeit/types';
import {yupResolver} from '@hookform/resolvers/yup';

const validationSchema = yup.object().shape({
});

const AuditionEditPage = () => {
  const { auditionId } = useParams<{ auditionId: string }>();
  const [audition, setAudition] = useState<Audition>()
  const loading = useSelector(selectAuditionsLoading);
  const auditions = useSelector(selectAuditions);
  const history = useHistory();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });
  const dispatch = useAppDispatch();

  const { handleSubmit, errors, reset } = methods;

  const handleSave = (data) => {
    setAudition({...audition, ...data})
    dispatch(saveAudition(audition))
      .then(unwrapResult)
      .then(p => history.push("/auditions"))
      .catch(e => dispatch(logError(e)))
  }
  const handleCancel = (data) => {
    history.goBack();
  }

  const title = auditionId === "new" ? "New Audition" : "Edit Audition";

  useEffect(() => {
    if (auditionId !== "new") {
      setAudition(auditions.find(a => a.id === auditionId))
      reset(audition)
    }
    else {
      setAudition({
        id: null,
        type: null,
        breakdown: {
          id: null,
          roleName: null,
          roleDescription: null,
              roleType: null,
              rate: null,
              attachments: [],
              project: {
                id: null,
                name: null,
                projectType: null,
                description: null,
                union: null,
                startDate: null,
                attachments: [],
                links: [],
            }
          },
          status: AuditionStatus.Accepted,
        });
    }
  }, [auditionId, setAudition, auditions, audition, reset])

  return (
    <div>
      {loading && <Loading />}
      {!loading &&
        <FormProvider {...methods}>
          <form>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Breadcrumbs>
                  <Button  variant="text" color="primary" onClick={handleCancel} startIcon={<ArrowBack />}>
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
                <TitledPaper variant="h6" component="h2" title="Project Details">
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Grid container direction="row" spacing={2}>
                        <Grid item xs={6}>
                          <TextInput name="breakdown.project.name" label="Project Name"
                            required={true}
                            errors={errors} />
                        </Grid>
                        <Grid item xs={3}>
                          <TextInput name="breakdown.project.name" label="Project Type"
                            required={true}
                            errors={errors} />
                        </Grid>
                        <Grid item xs={3}>
                          <TextInput name="breakdown.project.startDate" label="Start Date" />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <TextInput name="breakdown.project.description" label="Description" />
                    </Grid>
                    <Grid item>
                      <Grid container direction="row" spacing={2}>
                        <Grid item xs={3}>
                          <TextInput name="breakdown.project.union" label="Union Status" />
                        </Grid>
                        <Grid item xs={3}>
                          <TextInput name="breakdown.project.unionContract" label="Union Contract" />
                        </Grid>
                        <Grid item xs={3}>
                          <TextInput name="breakdown.project.unionStatusPending" label="Status Pending?" />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      Add attachments here...
                    </Grid>
                    <Grid item>
                      Add links here...
                    </Grid>
                    <Grid item>
                      Add participants? here...
                    </Grid>
                  </Grid>
                </TitledPaper>
              </Grid>
              <Grid item>
                <TitledPaper variant="h6" component="h2" title="Role/Breakdown Details">
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Grid container direction="row" spacing={2}>
                        <Grid item xs={6}>
                          <TextInput name="breakdown.roleName" label="Role Name"
                            required={true}
                            errors={errors} />
                        </Grid>
                        <Grid item xs={3}>
                          <TextInput name="breakdown.roleType" label="Type" />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <TextInput name="breakdown.roleDescription" label="Description" />
                    </Grid>
                    <Grid item>
                      <Grid container direction="row" spacing={2}>
                        <Grid item xs={2}>
                          <TextInput name="breakdown.rate" label="Rate / Pay" />
                        </Grid>
                        <Grid item xs={2}>
                          <TextInput name="breakdown.gender" label="Gender" />
                        </Grid>
                        <Grid item xs={2}>
                          <TextInput name="breakdown.ageMin" label="Age (from)" />
                        </Grid>
                        <Grid item xs={2}>
                          <TextInput name="breakdown.ageMax" label="Age (to)" />
                        </Grid>
                        <Grid item xs={2}>
                          <TextInput name="breakdown.ethnicities" label="Ethnicities" />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      Add attachments here...
                    </Grid>
                  </Grid>
                </TitledPaper>
              </Grid>
              <Grid item>
                <TitledPaper variant="h6" component="h2" title="Audition Details">
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Grid container direction="row" spacing={2}>
                        <Grid item xs={2}>
                          <TextInput name="type" label="Type" />
                        </Grid>
                        <Grid item xs={2}>
                          <TextInput name="auditionTime" label="Date / Time" />
                        </Grid>
                        <Grid item xs={2}>
                          <TextInput name="deadline" label="Submission Deadline" />
                        </Grid>
                        <Grid item xs={2}>
                          <TextInput name="callbackDate" label="Callback Date" />
                        </Grid>
                        <Grid item xs={2}>
                          <TextInput name="status" label="Status" />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <TextInput name="instructions" label="Instructions" />
                    </Grid>
                    <Grid item xs={6}>
                      <TextInput name="address" label="Address" />
                    </Grid>
                    <Grid item>
                      Add attachments here...
                    </Grid>
                  </Grid>
                </TitledPaper>
              </Grid>
              <Grid item>
                <Grid container spacing={2} direction="row">
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={handleSubmit(handleSave)} startIcon={<SaveAltOutlined />}>
                      Save
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="default" onClick={handleCancel} startIcon={<CancelOutlined />}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      }
    </div>
  );
}

export default AuditionEditPage;
