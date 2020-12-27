import { Transaction, TransactionRelationType } from '@makeit/types';
import { Dialog, DialogContent, makeStyles } from '@material-ui/core';
import React from 'react';
import TransactionEdit from './TransactionEdit';

export const useStyles = makeStyles((theme) => ({
  mainContent: {
    overflow: 'hidden'
  }
}));

export const TransactionEditDialog = (props: { onSave: (t: Transaction) => void, onCancel: () => void, related?, relatedType?:TransactionRelationType, open: boolean }) => {
  const { related, relatedType, onSave, onCancel, open } = props;
  const classes = useStyles();

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onCancel}>
      <DialogContent className={classes.mainContent}>
        <TransactionEdit onSave={onSave} onCancel={onCancel} related={related} relatedType={relatedType} stacked/>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEditDialog;
