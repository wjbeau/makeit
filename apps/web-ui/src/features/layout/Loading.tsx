import { CircularProgress, Grid, Typography } from '@material-ui/core';
import React from 'react';

export const Loading = () => {
    return (
        <Grid container direction="column" justify="center" alignItems="center">
            <Grid item>
                <CircularProgress />
            </Grid>
            <Grid item>
                <Typography variant="body2">
                    Loading...
                </Typography>
            </Grid>
        </Grid>
    );
}

export default Loading;
