import { HasAttachments } from '@makeit/types';
import { Badge, Button, IconButton, makeStyles, Menu } from '@material-ui/core';
import { Link } from '@material-ui/icons';
import { FieldArray } from 'formik';
import React, { useState } from 'react';
import { FieldArrayHelperContainer } from './AttachmentPanel';
import LinkAttachment from './LinkAttachment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const LinkAttachmentMenu = (props: {
  container: HasAttachments;
  iconOnly?: boolean;
  helpers?: FieldArrayHelperContainer;
  rootPath?: string;
  readOnly: boolean;
}) => {
  const classes = useStyles();
  const { container, iconOnly, helpers, rootPath, readOnly } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState(null);

  const path = rootPath && rootPath.length ? rootPath + '.links' : 'links';

  const handleClick = (evt) => {
    setAnchor(evt.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {container.links?.length > 0 && (
        <Badge
          badgeContent={container.links.length}
          color="primary"
          overlap={iconOnly ? 'circle' : 'rectangle'}
        >
          {iconOnly && (
            <IconButton onClick={handleClick}>
              <Link />
            </IconButton>
          )}
          {!iconOnly && (
            <Button
              onClick={handleClick}
              startIcon={<Link />}
              variant="text"
              color="default"
            >
              Links
            </Button>
          )}
        </Badge>
      )}
      <Menu
        id="link-menu"
        anchorEl={anchor}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        {readOnly &&
          container.links?.map((a, index) => (
            <div key={index}>
              <LinkAttachment link={a} readOnly={readOnly} />
            </div>
          ))}
        {!readOnly && (
          <FieldArray
            name={path}
            render={(arrayHelpers) => {
              helpers.linkArrayHelper = arrayHelpers;
              return container.links?.map((a, index) => (
                <div key={index}>
                  <LinkAttachment
                    link={a}
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

export default LinkAttachmentMenu;
