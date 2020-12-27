import {
  IconButton,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  MoreVert,
  MonetizationOn,
  AccountBalanceWallet,
} from '@material-ui/icons';
import React, { useState } from 'react';
import TransactionEditDialog from '../finance/TransactionEditDialog';
import TransactionListDialog from '../finance/TransactionListDialog';
import { Audition, TransactionRelationType } from '@makeit/types';

export const useStyles = makeStyles((theme) => ({}));

export const AuditionCardMoreMenu = (props: { audition: Audition }) => {
  const { audition } = props;
  const classes = useStyles();
  const [anchor, setAnchor] = useState(null);
  const [transactionEditOpen, setTransactionEditOpen] = React.useState(false);
  const [transactionListOpen, setTransactionListOpen] = React.useState(false);

  const handleShowMenu = (evt) => {
    setAnchor(evt.currentTarget);
  };

  return (
    <>
      <IconButton onClick={handleShowMenu}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchor}
        keepMounted
        open={!!anchor}
        onClose={() => setAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setTransactionEditOpen(true);
            setAnchor(null);
          }}
        >
          <ListItemIcon>
            <MonetizationOn fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add Income/Expense" />
        </MenuItem>
        <MenuItem onClick={() => {
            setTransactionListOpen(true);
            setAnchor(null);
          }}>
          <ListItemIcon>
            <AccountBalanceWallet fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View Income/Expenses" />
        </MenuItem>
        <TransactionEditDialog
          onSave={(t) => setTransactionEditOpen(false)}
          onCancel={() => setTransactionEditOpen(false)}
          open={transactionEditOpen}
          related={audition}
          relatedType={TransactionRelationType.Audition}
        />
        <TransactionListDialog
          onClose={() => setTransactionListOpen(false)}
          open={transactionListOpen}
          related={audition}
          relatedType={TransactionRelationType.Audition}
        />
      </Menu>
    </>
  );
};

export default AuditionCardMoreMenu;
