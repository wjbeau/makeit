import { PersonInfo } from '@makeit/types';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Avatar from 'react-avatar-edit';
import { useAppDispatch } from '../../app/store';
import { logError } from '../logging/logging.slice';

const MAX_FILE_SIZE = 500000;

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(1),
  },
  preview: {
    width: 200,
    height: 200
  },
}));

export const AvatarEdit = (props: { person: PersonInfo; onChange: (preview) => void }) => {
  const { person, onChange } = props;
  const classes = useStyles();

  const [avatar, setAvatar] = useState(person.avatar);
  const [preview, setPreview] = useState(null);
  const dispatch = useAppDispatch();

  const onClose = () => {
    setPreview(null);
  };
  const onCrop = (preview) => {
    setPreview(preview);
    onChange(preview);
  };

  const onBeforeFileLoad = (elem) => {
    if (elem.target.files[0].size > MAX_FILE_SIZE) {
      elem.target.value = '';
      dispatch(logError({ message: 'File is too large.'}))
    }
  };

  return (
    <Grid container spacing={1} direction="row">
      <Grid item>
        <Typography variant="subtitle1">
          Original
        </Typography>
        <Avatar
          width={200}
          height={200}
          onCrop={onCrop}
          onClose={onClose}
          onBeforeFileLoad={onBeforeFileLoad}
          src={avatar}
        />
      </Grid>
      {preview && <Grid item>
        <Typography variant="subtitle1">
          Preview
        </Typography>
        <div>
          <img src={preview} alt="Preview" className={classes.preview}/>
        </div>
      </Grid>}
    </Grid>
  );
};

export default AvatarEdit;
