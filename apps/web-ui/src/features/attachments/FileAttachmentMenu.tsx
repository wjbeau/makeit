import { HasAttachments } from '@makeit/types';
import { Badge, Button, IconButton, makeStyles, Menu } from '@material-ui/core';
import { AttachFile, Link } from '@material-ui/icons';
import { FieldArray } from 'formik';
import React, { useState } from 'react';
import { FieldArrayHelperContainer } from './AttachmentPanel';
import FileAttachment from './FileAttachment';
import LinkAttachment from './LinkAttachment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const FileAttachmentMenu = (props: {
  container: HasAttachments;
  iconOnly?: boolean;
  helpers?: FieldArrayHelperContainer;
  rootPath?: string;
  readOnly?: boolean;
  className?
}) => {
  const classes = useStyles();
  const { container, iconOnly, rootPath, readOnly, helpers, className } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState(null);

  const path =
    rootPath && rootPath.length ? rootPath + '.attachments' : 'attachments';

  const handleClick = (evt) => {
    setAnchor(evt.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {container.attachments?.length > 0 && (
        <Badge
          className={className}
          badgeContent={container.attachments.length}
          color="primary"
          overlap={iconOnly ? 'circle' : 'rectangle'}
        >
          {iconOnly && (
            <IconButton onClick={handleClick}>
              <AttachFile />
            </IconButton>
          )}
          {!iconOnly && (
            <Button
              onClick={handleClick}
              startIcon={<AttachFile />}
              variant="text"
              color="default"
            >
              Files
            </Button>
          )}
        </Badge>
      )}
      <Menu
        id="attachments-menu"
        anchorEl={anchor}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        {readOnly &&
          container.attachments?.map((a, index) => (
            <div key={index}>
              <FileAttachment attachment={a} readOnly={readOnly} />
            </div>
          ))}
        {!readOnly && (
          <div>
            <FieldArray
              name={path}
              render={(arrayHelpers) => {
                helpers.fileArrayHelper = arrayHelpers;
                return container.attachments?.map((a, index) => (
                  <div key={index}>
                    <FileAttachment
                      attachment={a}
                      readOnly={readOnly}
                      onDelete={() => arrayHelpers.remove(index)}
                    />
                  </div>
                ));
              }}
            />
          </div>
        )}
      </Menu>
    </>
  );
};

export default FileAttachmentMenu;
