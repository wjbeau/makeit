import { Event } from '@makeit/types';
import {
  Avatar, Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Grid, IconButton, makeStyles,
  Typography
} from '@material-ui/core';
import { Close, ExpandMore, MoreVert } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import Moment from 'react-moment';
import ParticipantAttachmentList from '../attachments/ParticipantAttachmentList';

const useStyles = makeStyles((theme) => ({
  root: {},
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  bold: {
    fontWeight: 'bold',
    marginTop: theme.spacing(0.5),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

export const EventCard = (props: {event: Event, expand?: boolean, onClose?: () => void}) => {
  const classes = useStyles();
  const {event, expand, onClose} = props
  const [expanded, setExpanded] = React.useState(expand);
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<Avatar>P</Avatar>}
        action={
          <>
            {onClose && (
              <IconButton aria-label="close" onClick={onClose}>
                <Close />
              </IconButton>
            )}
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          </>
        }
        title={event.title}
        subheader={
          <span>
            <span>Starts on:</span>
            <Moment interval={0} format="LLL">
              {event.start}
            </Moment>
          </span>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container spacing={2}>
            {event.description && (
              <Grid item xs={12}>
                <Typography variant="body2" className={classes.bold}>
                  Description
                </Typography>
                <Typography variant="body2">
                  {event.description}
                </Typography>
              </Grid>
            )}
            {event.participants && event.participants.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" className={classes.bold}>
                  Participants
                </Typography>
                <ParticipantAttachmentList
                  container={event}
                  readOnly={true}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Collapse>
      <CardActions disableSpacing>
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
    </Card>
  );
};

export default EventCard;
