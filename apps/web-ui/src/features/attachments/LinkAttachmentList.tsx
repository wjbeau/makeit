import { HasAttachments, Link } from '@makeit/types';
import { List, makeStyles } from '@material-ui/core';
import React from 'react';
import LinkAttachment from './LinkAttachment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const LinkAttachmentList = (props: { container: HasAttachments, readOnly }) => {
  const classes = useStyles();
  
  return (
    <List className={classes.root} disablePadding={true}>
      {props.container.links.map((a) => (
        <LinkAttachment key={a.url} link={a} />
      ))}
    </List>
  );
};

export default LinkAttachmentList;
