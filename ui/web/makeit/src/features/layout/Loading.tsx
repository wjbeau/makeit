import { Grid } from '@material-ui/core';
import React from 'react';

export const Loading = () => {
    return (
        <Grid container direction="row" justify="center" alignItems="center">
            <Grid item>
                Loading...
            </Grid>
        </Grid>
    );
}

export default Loading;
