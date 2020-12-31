import { ProjectEventType, ProjectEvent } from '@makeit/types';
import {
  Collapse,
  fade,
  Grid,
  IconButton,
  makeStyles,
  Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import Moment from 'react-moment';
import { Converter } from '../../app/Converters';
import AddressDisplay from '../controls/AddressDisplay';

const useStyles = makeStyles((theme) => ({
    container: {},
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
  expander: {},
  highlight: {
    color: theme.palette.secondary.dark,
    borderLeft: '3px solid ' + theme.palette.secondary.dark,
    backgroundColor: fade(theme.palette.secondary.dark, 0.1)
  },
  title: {
    marginTop: 5
  },
  subtitle: {

  },
  details: {
    paddingLeft: theme.spacing(6),
    width: '100%',
    color: theme.palette.text.primary
  },
  detailText: {
    marginTop: theme.spacing(1)
  }
}));

export const ProjectEventDisplay = (props: {
  event: ProjectEvent;
  expand?: boolean;
  highlight?: boolean;
  className?
}) => {
  const { event, expand, highlight, className } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(expand);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid container
        className={clsx(className, classes.container, {
        [classes.highlight]: highlight,
        })}>
      <Grid item className={classes.expander}>
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
      </Grid>
      <Grid item>
        <Typography variant="body2" color="textPrimary" className={classes.title}>
          {Converter.getLabelForEnum(ProjectEventType, event.eventType)}
        </Typography>
        <Typography variant="body2" color="textSecondary" className={classes.subtitle}>
          <Moment interval={0} format="lll">
            {event.time}
          </Moment>
        </Typography>
      </Grid>
      <Collapse in={expanded} timeout="auto" unmountOnExit className={classes.details}>
        {event.location && (
          <Grid item xs={12}>
            <AddressDisplay
              singleLine={true}
              address={event.location}
              variant="body2"
              className={classes.detailText}
            />
          </Grid>
        )}
        {event.notes && (
          <Grid item xs={12}>
            <Typography variant="body2"
              className={classes.detailText}>{event.notes}</Typography>
          </Grid>
        )}
      </Collapse>
    </Grid>
  );
};

export default ProjectEventDisplay;
