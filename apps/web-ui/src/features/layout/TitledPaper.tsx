import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(3)
    }
}));

export const TitledPaper = (props:any) => {
    const {variant, title, className} = props
    const classes = useStyles()
    return (
        <Grid container direction="column" className={className}>
            <Grid item>
                <Typography variant={variant}>{title}</Typography>
            </Grid>
            <Grid item>
                <Paper className={classes.paper}>
                    {props.children}
                </Paper>
            </Grid>
        </Grid>
    );
}

export default TitledPaper;
