import { Grid, makeStyles, Typography, useTheme } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        overflow: 'hidden'
    },
    titleContainer: {
        borderBottom: "1px solid " + theme.palette.divider,
        marginBottom: theme.spacing(2)
    }
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TitledSection = (props: {variant?, component?, title: string, children?, spacing?: 0|1|2|3|4|5|6|7|8}) => {
    const {variant, title, component, children, spacing} = props
    const classes = useStyles()
    const useSpacing = spacing !== undefined ? spacing : 1;
    const theme = useTheme();

    return (
        <div className={classes.root} style={{padding: theme.spacing(useSpacing)}}>
            <div className={classes.titleContainer}>
                <Typography variant={variant} component={component}>{title}</Typography>
            </div>
            <div>
                {children} 
            </div>
        </div>
    );
}

export default TitledSection;
