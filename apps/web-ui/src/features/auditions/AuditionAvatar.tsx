import { Avatar, Card, CardActions, CardContent, CardHeader, Collapse,  IconButton, makeStyles, Typography } from '@material-ui/core';
import { Edit, ExpandMore, MoreVert } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    avatar: {
        background: theme.palette.info.dark
    },
    audition: {
        background: theme.palette.info.light
    },
    callback: {
        background: theme.palette.info.main
    }
}));

export const AuditionAvatar = (props: { type: string }) => {
    const { type } = props
    const classes = useStyles()
    const typeName = type.toLowerCase();

    const firstLetter = () => {
        return type.substring(0, 1).toUpperCase();
    }

    return (
        <Avatar aria-label={type} className={classes[typeName] ? classes[typeName] : classes.avatar}>
            {firstLetter()}
        </Avatar>
    );
}

export default AuditionAvatar;
