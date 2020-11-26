import React from 'react';
import { doLogout, selectAuthed } from "../auth/auth.slice";
import logo from '../../assets/img/logo.svg';
import { useAppDispatch } from '../../app/store';
import { AppBar, Toolbar, Typography, Button, SvgIcon } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import { IfAuthenticated } from '../auth/IfAuthenticated';

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

    const handleLogout = () => {
        dispatch(doLogout());
    };

    return (
        <header className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <SvgIcon titleAccess="logo">
                        {logo}
                    </SvgIcon>
                    <Typography variant="h6" className={classes.title}>
                        Make It!
                    </Typography>
                    <IfAuthenticated>
                        <Button color="inherit" onClick={handleLogout}>Log out</Button>
                    </IfAuthenticated>
                </Toolbar>
            </AppBar>
        </header>
    );
}
