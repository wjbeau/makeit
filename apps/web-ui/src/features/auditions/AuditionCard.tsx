import { Audition, AuditionType } from '@makeit/types';
import {
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
import { useHistory } from 'react-router-dom';
import { Converter } from '../../app/Converters';
import { useAppDispatch } from '../../app/store';
import FileAttachmentMenu from '../attachments/FileAttachmentMenu';
import LinkAttachmentMenu from '../attachments/LinkAttachmentMenu';
import ParticipantAttachmentMenu from '../attachments/ParticipantAttachmentMenu';
import { AuditionAvatar } from './AuditionAvatar';
import AuditionCardActions from './AuditionCardActions';

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

export const AuditionCard = (props: {
  audition: Audition;
  expand?: boolean;
  onClose?: () => void;
}) => {
  const { audition, expand, onClose } = props;
  const classes = useStyles();
  const history = useHistory();
  const [expanded, setExpanded] = React.useState(!!expand);
  const dispatch = useAppDispatch();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const buildTitle = () => {
    let result = '';

    if (audition?.breakdown?.roleName) {
      result += audition?.breakdown?.roleName;
    }
    if (audition?.breakdown?.project?.name) {
      if (result.length) {
        result += ' / ';
      }
      result += audition?.breakdown?.project?.name;
    }

    if (!result.length) {
      result = Converter.getLabelForEnum(AuditionType, audition.type);
    }

    return result;
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<AuditionAvatar audition={audition} />}
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
        title={buildTitle()}
        subheader={
          <>
            {audition.auditionTime && (
              <Moment interval={0} format="LLL">
                {audition.auditionTime}
              </Moment>
            )}
            {!audition.auditionTime && 'No date set'}
          </>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container spacing={2}>
            {audition.instructions && (
              <Grid item xs={12}>
                <Typography variant="body2" className={classes.bold}>
                  Instructions
                </Typography>
                <Typography variant="body2">
                  {audition?.instructions}
                </Typography>
              </Grid>
            )}
            {audition.address && audition.address.line1 && (
              <Grid item xs={12}>
                <Typography variant="body2" className={classes.bold}>
                  Address
                </Typography>
                <Typography variant="body2">
                  {audition?.address?.line1}
                </Typography>
                <Typography variant="body2">
                  {audition?.address?.line2}
                </Typography>
                <Typography variant="body2">
                  {audition?.address?.line3}
                </Typography>
                <Typography variant="body2">
                  {audition?.address?.city}
                  {', ' + audition?.address?.state} {audition?.address?.zip}
                </Typography>
              </Grid>
            )}
            {((audition.attachments && audition.attachments.length > 0) ||
              (audition.links && audition.links.length > 0) ||
              (audition.participants && audition.participants.length > 0)) && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <FileAttachmentMenu container={audition} />
                  </Grid>
                  <Grid item>
                    <LinkAttachmentMenu container={audition} />
                  </Grid>
                  <Grid item>
                    <ParticipantAttachmentMenu container={audition} />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Collapse>
      <CardActions disableSpacing>
        <AuditionCardActions audition={audition} />
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

export default AuditionCard;
