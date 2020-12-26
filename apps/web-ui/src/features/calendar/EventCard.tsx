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
import ParticipantAttachmentMenu from '../attachments/ParticipantAttachmentMenu';
import EventEditButton from './EventEditButton';
import TitledSection from '../layout/TitledSection';
import AddressDisplay from '../controls/AddressDisplay';
import FileAttachmentMenu from '../attachments/FileAttachmentMenu';
import LinkAttachmentMenu from '../attachments/LinkAttachmentMenu';

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
  titleCell: {
    paddingTop: 5,
    paddingRight: theme.spacing(2),
  },
  attachmentIcons: {
    marginTop: theme.spacing(1),
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
        title={
          <Grid container>
            <Grid item className={classes.titleCell}>
              <Typography variant="body2" color="textPrimary">
                {event.title}
              </Typography>
              {event.start && (
                <Typography variant="body2" color="textSecondary">
                  <Moment interval={0} format="lll">
                    {event.start}
                  </Moment>
                </Typography>
              )}
              {event.end && (
                <Typography variant="body2" color="textSecondary">
                  to&nbsp;
                  <Moment interval={0} format="lll">
                    {event.end}
                  </Moment>
                </Typography>
              )}
            </Grid>
            {(event.participants?.length > 0 ||
              event.attachments?.length > 0 ||
              event.links.length > 0) && (
              <Grid item className={classes.attachmentIcons}>
                <Grid container spacing={2}>
                  <Grid item>
                    <FileAttachmentMenu container={event} iconOnly readOnly />
                    <LinkAttachmentMenu container={event} iconOnly readOnly />
                    <ParticipantAttachmentMenu
                      container={event}
                      iconOnly
                      readOnly
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
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
                <TitledSection title="Address Location" variant="body2">
                  <AddressDisplay address={event.location} variant="body2" />
                </TitledSection>
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
