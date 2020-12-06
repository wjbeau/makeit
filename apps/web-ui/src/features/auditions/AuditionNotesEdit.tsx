import { Audition } from '@makeit/types';
import {
  Button,
  Divider,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import { Delete, NoteAdd } from '@material-ui/icons';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { selectAuthed } from '../auth/auth.slice';
import TextInput from '../forms/TextInput';
import TitledPaper from '../layout/TitledPaper';
import ActionButtons from './ActionButtons';

const useStyles = makeStyles((theme) => ({
  addNoteContainer: {
    marginTop: theme.spacing(2),
  },
  button: {
      marginRight: theme.spacing(1)
  },
  title: {
    display: 'inline-block',
    fontWeight: 'bold',
    paddingTop: theme.spacing(2)
  },
  secondaryTitle: {
    display: 'inline-block',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2)
  }
}));

const AuditionNotesEdit = (props: {
  audition: Audition;
}) => {
  const classes = useStyles();
  const user = useSelector(selectAuthed);
  const methods = useForm<Audition>({
    defaultValues: props.audition
  });
  const { errors, control } = methods;
  const { fields, append, remove } = useFieldArray(
    {
      control,
      name: 'notes',
    }
  );

  return (
    <TitledPaper variant="h6" component="h2" title="Notes">
      <Grid container direction="column" spacing={2}>
        {fields &&
          fields.map((note, index) => (
            <Grid item key={note.id}>
              {index > 0 && <Divider />}
              <Typography variant="body2" component="p" className={classes.title}>
                Note {index + 1}
              </Typography>
              <Typography color="textSecondary" variant="body2" component="p" className={classes.secondaryTitle}>
                (on <Moment format='lll'>{note.createdOn}</Moment> by {note.createdBy.firstName + ' ' + note.createdBy.lastName})
              </Typography>
              <TextInput
                name={`notes[${index}].description`}
                label="Description"
                multiline
              />
              <ActionButtons>
                <Button startIcon={<Delete />} color="primary" variant="text" className={classes.button} onClick={() => remove(index)}>Delete Note</Button>
              </ActionButtons>
            </Grid>
          ))}
        <Grid item className={classes.addNoteContainer}>
          <Button
            startIcon={<NoteAdd />}
            color="primary"
            variant="text"
            onClick={() => append({ createdBy: user, createdOn: new Date().toISOString(), description: '' })}
          >
            Add Note
          </Button>
        </Grid>
      </Grid>
    </TitledPaper>
  );
};

export default AuditionNotesEdit;
