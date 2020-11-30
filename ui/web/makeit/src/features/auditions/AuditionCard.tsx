import { Avatar, Card, CardActions, CardContent, CardHeader, Collapse,  IconButton, makeStyles, Typography } from '@material-ui/core';
import { Edit, ExpandMore, MoreVert } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: theme.palette.info.dark,
    },
}));

export const AuditionCard = (props: any) => {
    const { audition } = props
    const classes = useStyles();
    const history = useHistory();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const goToEdit = () => {
        history.push("/meetings/" + audition.id + "/edit")
    };

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="meeting" className={classes.avatar}>
                        M
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVert />
                    </IconButton>
                }
                title={audition.subject}
                subheader={audition.startTime}
            />
            <CardActions disableSpacing>
                <IconButton aria-label="edit" onClick={goToEdit}>
                    <Edit />
                </IconButton>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMore />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>{audition.subject}</Typography>
                    <Typography paragraph>
                        Details to follow, etc...
                    </Typography>
                    <Typography paragraph>
                        Blah blah blah
                    </Typography>
                    <Typography paragraph>
                        yakety shmakety
                    </Typography>
                    <Typography>
                        other stuff
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default AuditionCard;
