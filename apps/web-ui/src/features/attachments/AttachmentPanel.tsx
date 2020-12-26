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

const useStyles = makeStyles((theme) => ({
  attachmentContainer: {
    marginTop: theme.spacing(2),
  },
  bold: {
    fontWeight: 'bold',
  },
  hidden: {
    display: 'none',
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
  const showFiles =
    (container as HasAttachments).attachments?.length > 0
      ? null
      : classes.hidden;
  const showLinks =
    (container as HasAttachments).links?.length > 0 ? null : classes.hidden;
  const showParticipants =
    (container as HasParticipants).participants?.length > 0
      ? null
      : classes.hidden;

  return (
      <Grid container spacing={3} direction="row" className={disableMargin ? null : classes.attachmentContainer}>
        {hasAttachments(container) && (
          <Grid item className={showFiles} xs={4}>
            <TitledSection title="Files">
              <FileAttachmentList
                rootPath={rootPath}
                container={container as HasAttachments}
                readOnly={false}
                helpers={helpers}
              />
            </TitledSection>
          </Grid>
        )}
        {hasAttachments(container) && (
          <Grid item className={showLinks} xs={4}>
            <TitledSection title="Links">
              <LinkAttachmentList
                rootPath={rootPath}
                container={container as HasAttachments}
                readOnly={false}
                helpers={helpers}
              />
            </TitledSection>
          </Grid>
        )}
        {hasParticipants(container) && (
          <Grid item className={showParticipants} xs={4}>
            <TitledSection title="Participants">
              <ParticipantAttachmentList
                rootPath={rootPath}
                container={container as HasParticipants}
                readOnly={false}
                helpers={helpers}
              />
            </TitledSection>
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
