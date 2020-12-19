import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(1),
        overflow: 'hidden'
    },
    titleContainer: {
        borderBottom: "1px solid " + theme.palette.divider,
        marginBottom: theme.spacing(2)
    }
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TitledSection = (props: {variant?, title: string, children?}) => {
    const {variant, title} = props
    const classes = useStyles()
    return (
        <Grid container direction="column" className={classes.root}>
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
