import { ModelFactory, Project, ProjectEventType } from '@makeit/types';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Delete, NoteAdd } from '@material-ui/icons';
import { FastField, FieldArray } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { selectAuthed } from '../auth/auth.slice';
import TitledPaper from '../layout/TitledPaper';
import AttachmentButtons from '../attachments/AttachmentButtons';
import AttachmentPanel from '../attachments/AttachmentPanel';
import { Converter } from '../../app/Converters';
import { KeyboardDateTimePicker } from 'formik-material-ui-pickers';

const useStyles = makeStyles((theme) => ({
  addNoteContainer: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  title: {
    display: 'inline-block',
    fontWeight: 'bold',
    paddingTop: theme.spacing(2),
  },
  secondaryTitle: {
    display: 'inline-block',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
}));

const ProjectEventsEdit = (props: { project: Project }) => {
  const classes = useStyles();
  const user = useSelector(selectAuthed);
  const formValues = props.project;

  return (
    <TitledPaper variant="h6" component="h2" title="Scheduled Events">
      <Grid container direction="column" spacing={2}>
        <FieldArray
          name="events"
          render={(arrayHelpers) => (
            <>
              {formValues &&
                formValues.events &&
                formValues.events.map((event, index) => (
                  <Grid item key={index}>
                    {index > 0 && <Divider />}
                    <Typography
                      variant="body2"
                      component="p"
                      className={classes.title}
                    >
                      Scheduled Event {index + 1}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={3}>
                        <FormControl fullWidth={true}>
                          <InputLabel htmlFor={'event-type-' + index}>
                            Event Type
                          </InputLabel>
                          <FastField
                            component={Select}
                            name={`events[${index}].eventType`}
                            inputProps={{ id: 'event-type-' + index }}
                            fullWidth={true}
                          >
                            {Converter.enumToMenuItems(
                              'ProjectEventType',
                              ProjectEventType
                            )}
                          </FastField>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <FastField
                          component={KeyboardDateTimePicker}
                          format="MM/DD/YYYY hh:mm a"
                          name={`events[${index}].time`}
                          label="Date / Time"
                          fullWidth={true}
                          initialFocusedDate={null}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container direction="row" spacing={2}>
                          <Grid item xs={3}>
                            <FastField
                              component={TextField}
                              name={`events[${index}].location.line1`}
                              label="Address Line 1"
                              fullWidth={true}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <FastField
                              component={TextField}
                              name={`events[${index}].location.line2`}
                              label="Line 2"
                              fullWidth={true}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <FastField
                              component={TextField}
                              name={`events[${index}].location.city`}
                              label="City"
                              fullWidth={true}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <FastField
                                  component={TextField}
                                  name={`events[${index}].location.state`}
                                  label="State"
                                  fullWidth={true}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <FastField
                                  component={TextField}
                                  name={`events[${index}].location.zip`}
                                  label="Zip"
                                  fullWidth={true}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <FastField
                          component={TextField}
                          name={`events[${index}].notes`}
                          label="Notes"
                          fullWidth={true}
                        />
                      </Grid>
                      <Grid item key={index} xs={12}>
                        <AttachmentPanel
                          container={event}
                          rootPath={`events[${index}]`}
                        >
                          <Button
                            startIcon={<Delete />}
                            color="primary"
                            variant="text"
                            className={classes.button}
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            Delete Event
                          </Button>
                          {index === formValues.events.length - 1 && (
                            <Button
                              startIcon={<NoteAdd />}
                              color="primary"
                              variant="text"
                              onClick={() =>
                                arrayHelpers.push({
                                  time: null,
                                  location: ModelFactory.createEmptyAddress(),
                                  notes: '',
                                  eventType: ProjectEventType.Rehearsal,
                                  links: [],
                                  attachments: [],
                                })
                              }
                            >
                              Add Event
                            </Button>
                          )}
                        </AttachmentPanel>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}

              {formValues?.events?.length === 0 && <Grid item className={classes.addNoteContainer}>
                <Button
                  startIcon={<NoteAdd />}
                  color="primary"
                  variant="text"
                  onClick={() =>
                    arrayHelpers.push({
                      time: null,
                      location: ModelFactory.createEmptyAddress(),
                      notes: '',
                      eventType: ProjectEventType.Rehearsal,
                      links: [],
                      attachments: [],
                    })
                  }
                >
                  Add Event
                </Button>
              </Grid>}
            </>
          )}
        />
      </Grid>
    </TitledPaper>
  );
};

export default ProjectEventsEdit;
