import {
  makeStyles,
  Menu,
  MenuItem
} from '@material-ui/core';
import { AccountBox, ExitToApp } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { doLogout } from '../auth/auth.slice';
import { userSet } from './user.slice';

const useStyles = makeStyles((theme) => ({
  menu: {
    marginTop: theme.spacing(4)
  },
  menuIcon: {
    marginRight: theme.spacing(2),
  },
}));

export const AccountMenu = (props: {
  anchor: Element;
  open: boolean;
  onClose: () => void;
}) => {
  const { anchor, open, onClose } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(doLogout());
    dispatch(userSet(null));
    history.push("/login")
    onClose();
  };

  const handleAccountClick = () => {
    history.push('/account');
    onClose();
  };

  return (
    <Menu
      id="call-menu"
      anchorEl={anchor}
      keepMounted
      open={open}
      onClose={onClose}
      className={classes.menu}
    >
      <MenuItem onClick={handleAccountClick}>
        <AccountBox className={classes.menuIcon} /> Account Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ExitToApp className={classes.menuIcon} /> Sign out
      </MenuItem>
    </Menu>
  );
};

export default AccountMenu;
