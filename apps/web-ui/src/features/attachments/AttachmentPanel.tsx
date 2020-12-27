import {
  hasAttachments,
  HasAttachments,
  hasParticipants,
  HasParticipants,
} from '@makeit/types';
import { Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import { display } from '@material-ui/system';
import React, { useState } from 'react';
import TitledSection from '../layout/TitledSection';
import AttachmentButtons from './AttachmentButtons';
import FileAttachmentList from './FileAttachmentList';
import LinkAttachmentList from './LinkAttachmentList';
import ParticipantAttachmentList from './ParticipantAttachmentList';
import FileAttachmentMenu from './FileAttachmentMenu';
import LinkAttachmentMenu from './LinkAttachmentMenu';
import ParticipantAttachmentMenu from './ParticipantAttachmentMenu';

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    marginTop: theme.spacing(2),
  },
  bold: {
    fontWeight: 'bold',
  },
}));

export class FieldArrayHelperContainer {
  public fileArrayHelper;
  public linkArrayHelper;
  public participantArrayHelper;
}

export const AttachmentPanel = (props: {
  container: HasAttachments | HasParticipants;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
  rootPath?: string;
  disableMargin?: boolean;
}) => {
  const classes = useStyles();
  const [helpers, setHelpers] = useState(new FieldArrayHelperContainer());
  const { container, disableMargin, rootPath, children } = props;

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      className={disableMargin ? null : classes.attachmentContainer}
    >
      {(container['attachments']?.length > 0 ||
        container['links']?.length > 0 ||
        container['participants']?.length > 0) && (
        <Grid item xs={12}>
          {hasAttachments(container) && (
            <>
              <FileAttachmentMenu
                rootPath={rootPath}
                container={container as HasAttachments}
                readOnly={false}
                helpers={helpers}
              />
              <LinkAttachmentMenu
                rootPath={rootPath}
                container={container as HasAttachments}
                readOnly={false}
                helpers={helpers}
              />
            </>
          )}
          {hasParticipants(container) && (
            <ParticipantAttachmentMenu
              rootPath={rootPath}
              container={container as HasParticipants}
              readOnly={false}
              helpers={helpers}
            />
          )}
        </Grid>
      )}
      <Grid item xs={12}>
        <AttachmentButtons container={container} helpers={helpers}>
          {children}
        </AttachmentButtons>
      </Grid>
    </Grid>
  );
};

export default AttachmentPanel;
