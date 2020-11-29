import React, { useEffect } from 'react';
import { useAppDispatch } from '../../app/store';
import Loading from '../layout/Loading';
import { Breadcrumbs, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { NavLink, useHistory } from 'react-router-dom';
import TextInput from '../forms/TextInput';

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from 'react-hook-form';
import TitledPaper from '../layout/TitledPaper';
import { ArrowBack } from '@material-ui/icons';

const validationSchema = yup.object().shape({
  subject: yup.string().required("Required"),
  type: yup.string().required("Required")
});

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  }
}));

const AuditionEditPage = (props: any) => {
  const { auditionId } = props;
  const loading = false;
  const dispatch = useAppDispatch();
  const history = useHistory();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });
  const classes = useStyles();

  const { handleSubmit, errors } = methods;

  const handleSave = (data: any) => {
    //TODO implement
  }
  const handleCancel = (data: any) => {
    history.goBack();
  }

  const title = auditionId === "new" ? "New Meeting" : "Edit Meeting";

  useEffect(() => {
    if (auditionId !== "new") {
      //TODO implement this
    }
  }, [dispatch, auditionId])

  return (
    <div>
      {loading && <Loading />}
      {!loading &&
        <FormProvider {...methods}>
          <form>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Breadcrumbs>
                  <NavLink color="inherit" to="/meetings" className={classes.link}>
                    <ArrowBack className={classes.icon} />
                    Back to Auditions
                  </NavLink>
                </Breadcrumbs>
              </Grid>
              <Grid item>
                <Typography variant="h4" component="h1">
                  {title}
                </Typography>
              </Grid>
              <Grid item>
                <TitledPaper variant="h6" component="h2" title="Meeting Details">
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <TextInput name="subject" label="Subject"
                        required={true}
                        errors={errors} />
                    </Grid>
                    <Grid item>
                      <TextInput name="type" label="Meeting Type"
                        required={true}
                        errors={errors} />
                    </Grid>
                    <Grid item>
                      <TextInput name="startTime" label="Start Time" />
                    </Grid>
                    <Grid item>
                      <TextInput name="endTime" label="End Time" />
                    </Grid>
                    <Grid item>
                      <TextInput name="location" label="Address" />
                    </Grid>
                  </Grid>
                </TitledPaper>
              </Grid>
              <Grid item>

                <Grid container direction="row" spacing={1}>
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={handleSubmit(handleSave)}>
                      Save
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="default" onClick={handleSubmit(handleCancel)}>
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
