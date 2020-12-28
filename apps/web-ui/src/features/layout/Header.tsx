import {
  AppBar,
  Avatar,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  AccountCircle,
  ChatBubble,
  Menu,
  Notifications,
} from '@material-ui/icons';
import React, { useState } from 'react';
import { useAppDispatch } from '../../app/store';
import { selectAuthed } from '../auth/auth.slice';
import { IfAuthenticated } from '../auth/IfAuthenticated';
import AccountMenu from '../profile/AccountMenu';
import { useSelector } from 'react-redux';
import logo from './logo.png';
import clsx from 'clsx';
import { selectDrawerOpen, setDrawerOpen } from './layout.slice';
import { DIMENSIONS } from './dimensions';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    position: 'fixed',
    left: 0,
    top: 0,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  logo: {
    height: 40,
    marginTop: 5,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  appBarShift: {
    width: `calc(100% - ${DIMENSIONS.drawerWidth}px)`,
    marginLeft: DIMENSIONS.drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

export function Header() {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const [accountAnchor, setAccountAnchor] = useState();
  const user = useSelector(selectAuthed);
  const open = useSelector(selectDrawerOpen);

  const handleProfileClick = (evt) => {
    setAccountAnchor(evt.currentTarget);
    setAccountMenuOpen(true);
  };

  const handleDrawerOpen = () => {
    dispatch(setDrawerOpen(true));
  };

  const handleDrawerClose = () => {
    dispatch(setDrawerOpen(false));
  };

  return (
    <header className={classes.root}>
      <AppBar
        position="static"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IfAuthenticated>
            <Hidden smUp>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <Menu />
              </IconButton>
            </Hidden>
          </IfAuthenticated>
          <Typography variant="h6" className={classes.title}>
            <img className={classes.logo} src={logo} alt="Make It!" />
          </Typography>
          <IfAuthenticated>
            <IconButton color="inherit">
              <ChatBubble />
            </IconButton>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            <IconButton color="inherit" onClick={handleProfileClick}>
              {!user?.avatar && <AccountCircle />}
              {user?.avatar && <Avatar src={user.avatar} />}
            </IconButton>
            <AccountMenu
              open={accountMenuOpen}
              onClose={() => setAccountMenuOpen(false)}
              anchor={accountAnchor}
            />
          </IfAuthenticated>
        </Toolbar>
      </AppBar>
    </header>
  );
}
