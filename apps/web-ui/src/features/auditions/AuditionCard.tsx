import { Audition, AuditionStatus, AuditionType } from '@makeit/types';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  IconButton,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Done, Edit, ExpandMore, MoreVert } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import Moment from 'react-moment';
import { useHistory } from 'react-router-dom';
import { Converter } from '../../app/Converters';
import { useAppDispatch } from '../../app/store';
import { logError, logSuccess } from '../logging/logging.slice';
import { saveAudition } from './audition.slice';
import { AuditionAvatar } from './AuditionAvatar';
import AuditionCardActions from './AuditionCardActions';
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

export const AuditionCard = (props: { audition: Audition }) => {
  const { audition } = props;
  const classes = useStyles();
  const history = useHistory();
  const [expanded, setExpanded] = React.useState(false);
  const dispatch = useAppDispatch();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const goToEdit = () => {
    history.push('/auditions/' + audition._id + '/edit');
  };

  const markAsComplete = () => {
    const oldStatus = audition.status;
    audition.status = AuditionStatus.Performed;
    dispatch(saveAudition(audition))
      .then((p) => {
        dispatch(logSuccess({ message: 'Audition marked as completed.' }));
      })
      .catch((e) => {
        audition.status = oldStatus;
        dispatch(logError(e));
      });
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
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
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
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container>
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
              <Grid item xs={6}>
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
            {audition.participants && audition.participants.length > 0 && (
              <Grid item xs={6}>
                <Typography variant="body2" className={classes.bold}>
                  Participants
                </Typography>
                <ParticipantAttachmentList participants={audition.participants} readOnly={true} />
              </Grid>
            )}
            {audition.attachments && audition.attachments.length > 0 && (
              <Grid item xs={6}>
                <Typography variant="body2" className={classes.bold}>
                  Attachments
                </Typography>
                {audition.attachments.map((a) => (
                  <Link key={a.reference} href={a.reference} target="_blank">
                    {a.displayName}
                  </Link>
                ))}
              </Grid>
            )}
            {audition.links && audition.links.length > 0 && (
              <Grid item xs={6}>
                <Typography variant="body2" className={classes.bold}>
                  Links
                </Typography>
                {audition.links.map((l) => (
                  <Link key={l.url} href={l.url} target="_blank">
                    {l.display}
                  </Link>
                ))}
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default AuditionCard;
