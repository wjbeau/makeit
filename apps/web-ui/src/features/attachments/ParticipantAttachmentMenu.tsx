import { HasAttachments, HasParticipants } from '@makeit/types';
import { Badge, Button, IconButton, makeStyles, Menu } from '@material-ui/core';
import { AttachFile, Link, Person } from '@material-ui/icons';
import { FieldArray } from 'formik';
import React, { useState } from 'react';
import { FieldArrayHelperContainer } from './AttachmentPanel';
import FileAttachment from './FileAttachment';
import LinkAttachment from './LinkAttachment';
import ParticipantAttachment from './ParticipantAttachment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const ParticipantAttachmentMenu = (props: {
  container: HasParticipants;
  iconOnly?: boolean;
  helpers?: FieldArrayHelperContainer;
  rootPath?: string;
  readOnly?: boolean;
}) => {
  const classes = useStyles();
  const { container, iconOnly, helpers, rootPath, readOnly } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState(null);

  const path =
    rootPath && rootPath.length ? rootPath + '.participants' : 'participants';

  const handleClick = (evt) => {
    setAnchor(evt.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {container.participants?.length > 0 && (
        <Badge
          badgeContent={container.participants.length}
          color="primary"
          overlap={iconOnly ? 'circle' : 'rectangle'}
        >
          {iconOnly && (
            <IconButton onClick={handleClick}>
              <Person />
            </IconButton>
          )}
          {!iconOnly && (
            <Button
              onClick={handleClick}
              startIcon={<Person />}
              variant="text"
              color="default"
            >
              Participants
            </Button>
          )}
        </Badge>
      )}
      <Menu
        id="participants-menu"
        anchorEl={anchor}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        {readOnly &&
          container.participants?.map((a, index) => (
            <div key={index}>
              <ParticipantAttachment participant={a} readOnly={readOnly} />
            </div>
          ))}
        {!readOnly && (
          <FieldArray
            name={path}
            render={(arrayHelpers) => {
              helpers.participantArrayHelper = arrayHelpers;
              return container.participants?.map((a, index) => (
                <div key={index}>
                  <ParticipantAttachment
                    participant={a}
                    readOnly={readOnly}
                    onDelete={() => arrayHelpers.remove(index)}
                  />
                </div>
              ));
            }}
          />
        )}
      </Menu>
    </>
  );
};

export default ParticipantAttachmentMenu;
