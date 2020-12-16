import { AppBar, Avatar, IconButton, SvgIcon, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle, ChatBubble, Notifications } from '@material-ui/icons';
import React, { useState } from 'react';
import { useAppDispatch } from '../../app/store';
import { doLogout, selectAuthed } from '../auth/auth.slice';
import { IfAuthenticated } from '../auth/IfAuthenticated';
import AccountMenu from "../profile/AccountMenu";
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        position: "fixed",
        left: 0,
        top: 0
    },
}));

export function Header() {
    const dispatch = useAppDispatch()
    const classes = useStyles()
    const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false)
    const [accountAnchor, setAccountAnchor] = useState()
    const user = useSelector(selectAuthed)


    const handleProfileClick = (evt) => {
        setAccountAnchor(evt.currentTarget);
        setAccountMenuOpen(true);
    };

    return (
        <header className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Make It!
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
                        <AccountMenu open={accountMenuOpen} onClose={() => setAccountMenuOpen(false)} anchor={accountAnchor} />
                    </IfAuthenticated>
                </Toolbar>
            </AppBar>
        </header>
    );
}
