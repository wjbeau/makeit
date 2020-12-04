import { Avatar, makeStyles } from '@material-ui/core';
import React from 'react';

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
    const typeName = type?.toLowerCase();

    const firstLetter = () => {
        const letter = type?.substring(0, 1).toUpperCase();
        return letter ? letter : "A"
    }

    return (
        <Avatar aria-label={type} className={classes[typeName] ? classes[typeName] : classes.avatar}>
            {firstLetter()}
        </Avatar>
    );
}

export default AuditionAvatar;
