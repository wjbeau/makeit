import { Event, Project, ProjectType } from '@makeit/types';
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
import * as moment from 'moment';
import React from 'react';
import Moment from 'react-moment';
import { Converter } from '../../app/Converters';
import FileAttachmentMenu from '../attachments/FileAttachmentMenu';
import LinkAttachmentMenu from '../attachments/LinkAttachmentMenu';
import ParticipantAttachmentMenu from '../attachments/ParticipantAttachmentMenu';
import TitledSection from '../layout/TitledSection';
import ProjectCardActions from './ProjectCardActions';
import ProjectEventDisplay from './ProjectEventDisplay';

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
  event: {
    marginTop: theme.spacing(1),
  },
  titleCell: {
    paddingTop: 5,
    paddingRight: theme.spacing(2)
  }
}));

const sortEvents = (a, b) => {
  const aTime = moment.default(a.time);
  const bTime = moment.default(b.time);

  if (aTime && bTime) {
    return aTime.diff(bTime);
  } else if (aTime && !bTime) {
    return -1;
  } else if (bTime && !aTime) {
    return 1;
  } else {
    return 0;
  }
};

export const ProjectCard = (props: {
  project: Project;
  expand?: boolean;
  onClose?: () => void;
  highlightedEvent?: Event;
}) => {
  const { project, expand, onClose, highlightedEvent } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(expand);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const events = [].concat(project.events);

  events?.sort(sortEvents);

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
                {project.name}
              </Typography>
              {project.projectType && (
                <Typography variant="body2" color="textSecondary">
                  {Converter.getLabelForEnum(ProjectType, project.projectType)}
                </Typography>
              )}
              {project.startDate && (
                <Typography variant="body2" color="textSecondary">
                  Starts{' '}
                  <Moment interval={0} format="lll">
                    {project.startDate}
                  </Moment>
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item>
                  <FileAttachmentMenu container={project} iconOnly />
                </Grid>
                <Grid item>
                  <LinkAttachmentMenu container={project} iconOnly />
                </Grid>
                <Grid item>
                  <ParticipantAttachmentMenu container={project} iconOnly />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container spacing={2}>
            {project.description && (
              <Grid item xs={12}>
                <Typography variant="body2">{project.description}</Typography>
              </Grid>
            )}
            {events?.length > 0 && (
              <Grid item xs={12}>
                <TitledSection
                  title="Project Events"
                  variant="body2"
                  spacing={0}
                >
                  {events.map((event, index) => (
                    <ProjectEventDisplay
                      event={event}
                      expand={false}
                      highlight={event._id === highlightedEvent?._id}
                      key={index}
                      className={index > 0 ? classes.event : null}
                    />
                  ))}
                </TitledSection>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Collapse>
      <CardActions disableSpacing>
        <ProjectCardActions project={project} />
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

export default ProjectCard;
