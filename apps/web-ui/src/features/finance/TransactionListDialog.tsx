import { Transaction, TransactionRelationType } from '@makeit/types';
import { Dialog, DialogActions, DialogContent, makeStyles, Button, IconButton, Typography, AppBar, Toolbar } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';
import TransactionEdit from './TransactionEdit';
import TransactionsList from './TransactionList';

export const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  mainContent: {
    overflow: 'hidden'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

export const TransactionListDialog = (props: { onClose: () => void, related?, relatedType?:TransactionRelationType, open: boolean }) => {
  const { related, relatedType, onClose, open } = props;
  const classes = useStyles();

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar className={classes.appBar} color="secondary" >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Income / Expenses
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.mainContent}>
        <TransactionsList related={related} relatedType={relatedType} />
      </DialogContent>
    </Dialog>
  );
};

export default TransactionListDialog;
