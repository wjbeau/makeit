import { Grid, makeStyles, Typography } from '@material-ui/core';
import { NotInterested } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    gray: {
        color: theme.palette.grey[500]
    },
}));

export const NothingToShow = (props: {message?: string}) => {
    const msg = props.message ? props.message : "Nothing to see here..."
    const classes = useStyles();

    return (
        <Grid container direction="column" justify="center" alignItems="center">
            <Grid item>
                <NotInterested className={classes.gray}/>
            </Grid>
            <Grid item>
                <Typography variant="body2" className={classes.gray}>
                    {msg}
                </Typography>
            </Grid>
        </Grid>
    );
}

export default NothingToShow;
