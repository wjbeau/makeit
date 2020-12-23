import { Project, ProjectType, ProjectEventType } from '@makeit/types';
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
  Typography,
} from '@material-ui/core';
import { Close, ExpandMore, MoreVert } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import Moment from 'react-moment';
import { Converter } from '../../app/Converters';
import FileAttachmentList from '../attachments/FileAttachmentList';
import LinkAttachmentList from '../attachments/LinkAttachmentList';
import ParticipantAttachmentList from '../attachments/ParticipantAttachmentList';
import ProjectCardActions from './ProjectCardActions';
import { Tooltip } from '@material-ui/core';

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

export const ProjectCard = (props: {
  project: Project;
  expand?: boolean;
  onClose?: () => void;
}) => {
  const { project, expand, onClose } = props;
  const classes = useStyles();
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
        title={project.name}
        subheader={
          <>
            {project.projectType && (
              <div>
                {Converter.getLabelForEnum(ProjectType, project.projectType)}
              </div>
            )}
            {project.startDate && (
              <div>
                Starts{' '}
                <Moment interval={0} format="lll">
                  {project.startDate}
                </Moment>
              </div>
            )}
          </>
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
            {project.events?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" className={classes.bold}>
                  Scheduled Events
                </Typography>
                {project.events.map((event, index) => {
                  return <div key={event._id}>
                    <Typography variant="body1">
                      {Converter.getLabelForEnum(
                        ProjectEventType,
                        event.eventType
                      )}
                    </Typography>
                    <Typography variant="body2">
                      <Moment interval={0} format="lll">
                        {event.time}
                      </Moment>
                    </Typography>
                    <Typography variant="body2">{event.notes}</Typography>
                  </div>
                })}
              </Grid>
            )}
            {project.attachments && project.attachments.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" className={classes.bold}>
                  Files
                </Typography>
                <FileAttachmentList container={project} readOnly={true} />
              </Grid>
            )}
            {project.links && project.links.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" className={classes.bold}>
                  Links
                </Typography>
                <LinkAttachmentList container={project} readOnly={true} />
              </Grid>
            )}
            {project.participants && project.participants.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" className={classes.bold}>
                  Participants
                </Typography>
                <ParticipantAttachmentList
                  container={project}
                  readOnly={true}
                />
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
