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
import AuditionDetailsEdit from './AuditionDetailsEdit';
import BreakdownDetailsEdit from './ProjectDetailsEdit';
import ProjectDetailsEdit from './ProjectDetailsEdit';

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
                <AuditionDetailsEdit />
              </Grid>
              <Grid item>
                <Grid container direction="row" spacing={3}>
                  <Grid item xs={6}>
                    <BreakdownDetailsEdit />
                  </Grid>
                  <Grid item xs={6}>
                    <ProjectDetailsEdit />
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
