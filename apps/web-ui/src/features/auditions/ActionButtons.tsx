import { Button, makeStyles } from '@material-ui/core';
import { AttachFile, Link, PersonAdd } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    attachmentContainer: {
        marginTop: theme.spacing(2)
    },
    button: {
        marginRight: theme.spacing(1)
    },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ActionButtons = (props: {children?: any}) => {
    const classes = useStyles();

    return (
        <div className={classes.attachmentContainer}>
            <Button startIcon={<AttachFile />} color="primary" variant="text" className={classes.button}>Add File</Button>
            <Button startIcon={<Link />} color="primary" variant="text" className={classes.button}>Add Link</Button>
            <Button startIcon={<PersonAdd />} color="primary" variant="text" className={classes.button}>Add Person</Button>
            {props.children}
        </div>
    );
}

export default ActionButtons;

