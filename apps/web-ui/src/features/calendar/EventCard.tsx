import { Event } from '@makeit/types';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Close, ExpandMore, MoreVert } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import Moment from 'react-moment';
import ParticipantAttachmentList from '../attachments/ParticipantAttachmentList';
import EventEditButton from './EventEditButton';

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

export const EventCard = (props: {
  event: Event;
  expand?: boolean;
  onClose?: () => void;
  onEdit?: () => void;
}) => {
  const classes = useStyles();
  const { event, expand, onClose, onEdit } = props;
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
              <Tooltip title="Close">
                <IconButton aria-label="close" onClick={onClose}>
                  <Close />
                </IconButton>
              </Tooltip>
            )}
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          </>
        }
        title={event.title}
        subheader={
          <>
            <div>
              <Moment interval={0} format="lll">
                {event.start}
              </Moment>
            </div>
            {event.end && (
              <div>
                to&nbsp;
                <Moment interval={0} format="lll">
                  {event.end}
                </Moment>
              </div>
            )}
          </>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container spacing={2}>
            {event.description && (
              <Grid item xs={12}>
                <Typography variant="body2">{event.description}</Typography>
              </Grid>
            )}
            {event.location && event.location.line1 && (
              <Grid item xs={12}>
                <Typography variant="body2" className={classes.bold}>
                  Address Location
                </Typography>
                <Typography variant="body2">{event.location?.line1}</Typography>
                <Typography variant="body2">{event.location?.line2}</Typography>
                <Typography variant="body2">{event.location?.line3}</Typography>
                <Typography variant="body2">
                  {event.location?.city}
                  {', ' + event.location?.state} {event.location?.zip}
                </Typography>
              </Grid>
            )}
            {event.participants && event.participants.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" className={classes.bold}>
                  Participants
                </Typography>
                <ParticipantAttachmentList container={event} readOnly={true} />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Collapse>
      <CardActions disableSpacing>
        <EventEditButton onClick={onEdit} />
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
