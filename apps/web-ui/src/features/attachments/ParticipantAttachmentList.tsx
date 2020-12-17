import { HasParticipants, Participant } from '@makeit/types';
import { List, makeStyles } from '@material-ui/core';
import { FieldArray } from 'formik';
import React from 'react';
import { FieldArrayHelperContainer } from './AttachmentPanel';
import ParticipantAttachment from './ParticipantAttachment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const ParticipantAttachmentList = (props: {
  container: HasParticipants;
  readOnly?: boolean;
  helpers?: FieldArrayHelperContainer;
  rootPath?: string;
}) => {
  const classes = useStyles();

  const { readOnly, rootPath, helpers, container } = props;

  const path =
    rootPath && rootPath.length
      ? rootPath + '.participants'
      : 'participants';
      
  return (
    <List className={classes.root} disablePadding={true}>
      {readOnly && container.participants.map((a) => (
        <ParticipantAttachment
          key={a.info.ref}
          participant={a}
          readOnly={readOnly}
        />
      ))}
      {!readOnly && (
        <FieldArray
          name={path}
          render={(arrayHelpers) => {
            helpers.participantArrayHelper = arrayHelpers;
            return container.participants.map((a, index) => (
              <ParticipantAttachment
                key={index}
                participant={a}
                readOnly={readOnly}
                onDelete={() => arrayHelpers.remove(index)}
              />
            ));
          }}
        />
      )}
    </List>
  );
};

export default ParticipantAttachmentList;
