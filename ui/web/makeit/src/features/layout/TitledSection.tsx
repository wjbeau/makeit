import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    titleContainer: {
        borderBottom: "1px solid " + theme.palette.divider,
        marginBottom: theme.spacing(2)
    }
}));

export const TitledSection = (props:any) => {
    const {variant, title, className} = props
    const classes = useStyles()
    return (
        <Grid container direction="column" className={className}>
            <Grid item className={classes.titleContainer}>
                <Typography variant={variant}>{title}</Typography>
            </Grid>
            <Grid item>
                {props.children}
            </Grid>
        </Grid>
    );
}

export default TitledSection;
