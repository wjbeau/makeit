import { HasAttachments, Link } from '@makeit/types';
import { List, makeStyles } from '@material-ui/core';
import { FieldArray } from 'formik';
import React from 'react';
import { FieldArrayHelperContainer } from './AttachmentPanel';
import LinkAttachment from './LinkAttachment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const LinkAttachmentList = (props: { container: HasAttachments, readOnly, helpers?: FieldArrayHelperContainer, rootPath?: string }) => {
  const classes = useStyles();
  const { readOnly, container, helpers, rootPath} = props;

  const path = rootPath && rootPath.length ? rootPath + ".links" : "links"
  
  return (
    <List className={classes.root} disablePadding={true}>
      {readOnly && container.links.map((a, index) => (
        <LinkAttachment key={index} link={a} readOnly={readOnly}/>
      ))}
      {!readOnly && 
        <FieldArray
          name={path}
          render={(arrayHelpers) => {
            helpers.linkArrayHelper = arrayHelpers;
            return container.links.map((a, index) => (
              <LinkAttachment key={index} link={a} readOnly={readOnly} onDelete={() => arrayHelpers.remove(index)} />
            ))
          }} />
      }
    </List>
  );
};

export default LinkAttachmentList;
