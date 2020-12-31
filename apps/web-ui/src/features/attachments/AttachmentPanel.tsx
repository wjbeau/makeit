import {
  hasAttachments,
  HasAttachments,
  hasParticipants,
  HasParticipants
} from '@makeit/types';
import { Grid, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import AttachmentButtons from './AttachmentButtons';
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
  hide: {
    display: 'none'
  }
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

  const showMenuIcons = (container['attachments']?.length > 0 ||
      container['links']?.length > 0 ||
      container['participants']?.length > 0);

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      className={disableMargin ? null : classes.attachmentContainer}
    >
      <Grid item xs={12} className={!showMenuIcons ? classes.hide : null}>
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
      <Grid item xs={12}>
        <AttachmentButtons container={container} helpers={helpers}>
          {children}
        </AttachmentButtons>
      </Grid>
    </Grid>
  );
};

export default AttachmentPanel;
