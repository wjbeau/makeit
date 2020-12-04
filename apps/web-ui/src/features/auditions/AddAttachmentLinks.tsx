import { ButtonGroup, Button, Grid, makeStyles, Backdrop } from '@material-ui/core';
import { AddCircleOutline, AttachFile, Link, PersonAdd } from '@material-ui/icons';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    dial: {
        position:'absolute',
        top: 0,
        right: 0
    },
}));

export const AddAttachmentLinks = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
      setOpen(false);
    };
  
    const handleOpen = () => {
      setOpen(true);
    };

    return (
        <SpeedDial
            ariaLabel="Attachment options"
            hidden={false}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            className={classes.dial}
            open={open}
            direction="down"
            >
                <SpeedDialAction
                key="attach-file"
                icon={<AttachFile />}
                tooltipTitle="File"
                tooltipOpen
                onClick={handleClose}
                />
                <SpeedDialAction
                key="attach-link"
                icon={<Link />}
                tooltipTitle="Link"
                tooltipOpen
                onClick={handleClose}
                />
                <SpeedDialAction
                key="attach-contact"
                icon={<PersonAdd />}
                tooltipTitle="Person"
                tooltipOpen
                onClick={handleClose}
                />
        </SpeedDial>
    );
}

export default AddAttachmentLinks;

