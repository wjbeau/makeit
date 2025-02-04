import { Audition, PersonInfo } from '@makeit/types';
import {
  Button,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Delete, NoteAdd } from '@material-ui/icons';
import { FastField, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { selectAuthed } from '../auth/auth.slice';
import TitledPaper from '../layout/TitledPaper';
import AttachmentPanel from '../attachments/AttachmentPanel';

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
    paddingLeft: theme.spacing(1),
  },
}));

const byLine = (person: PersonInfo) => {
  let line = ""
  if(person?.firstName) {
    line += person.firstName
  }
  if(person?.lastName) {
    if(line.length) line += " "
    line += person.lastName
  }

  return line.length ? "by " + line : ''
}

const AuditionNotesEdit = (props: { formValues: Audition }) => {
  const classes = useStyles();
  const user = useSelector(selectAuthed);
  const formValues = props.formValues;

  return (
    <TitledPaper variant="h6" component="h2" title="Notes">
      <Grid container direction="column" spacing={2}>
        <FieldArray
          name="notes"
          render={(arrayHelpers) => (
            <>
              {formValues &&
                formValues.notes &&
                formValues.notes.map((note, index) => (
                  <Grid item key={index}>
                    {index > 0 && <Divider />}
                    <div>
                      <Typography
                        variant="body2"
                        component="p"
                        className={classes.title}
                      >
                        Note {index + 1}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        component="p"
                        className={classes.secondaryTitle}
                      >
                        on <Moment format="lll">{note.createdOn}</Moment> {byLine(note.createdBy)}
                      </Typography>
                      <FastField
                        component={TextField}
                        name={`notes[${index}].description`}
                        label="Description"
                        multiline
                        fullWidth={true}
                      />
                    </div>
                    <AttachmentPanel
                      container={note}
                      rootPath={`notes[${index}]`}
                    >
                      <Button
                        startIcon={<Delete />}
                        color="primary"
                        variant="text"
                        className={classes.button}
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        Delete Note
                      </Button>
                      {index === formValues.notes.length - 1 && (
                        <Button
                          startIcon={<NoteAdd />}
                          color="primary"
                          variant="text"
                          onClick={() =>
                            arrayHelpers.push({
                              createdBy: user,
                              createdOn: new Date().toISOString(),
                              description: '',
                              links: [],
                              attachments: [],
                            })
                          }
                        >
                          Add Note
                        </Button>
                      )}
                    </AttachmentPanel>
                  </Grid>
                ))}

              {!formValues.notes?.length && (
                <Grid item className={classes.addNoteContainer}>
                  <Button
                    startIcon={<NoteAdd />}
                    color="primary"
                    variant="text"
                    onClick={() =>
                      arrayHelpers.push({
                        createdBy: user,
                        createdOn: new Date().toISOString(),
                        description: '',
                        links: [],
                        attachments: [],
                      })
                    }
                  >
                    Add Note
                  </Button>
                </Grid>
              )}
            </>
          )}
        />
      </Grid>
    </TitledPaper>
  );
};

export default AuditionNotesEdit;
