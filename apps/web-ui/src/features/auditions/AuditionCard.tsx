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
import { Edit, ExpandMore, MoreVert } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { AuditionAvatar } from './AuditionAvatar';
import Moment from 'react-moment';
import { Audition } from '@makeit/types';

const useStyles = makeStyles((theme) => ({
  root: {},
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
}));

export const AuditionCard = (props: {audition: Audition}) => {
  const { audition } = props;
  const classes = useStyles();
  const history = useHistory();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const goToEdit = () => {
    history.push('/auditions/' + audition._id + '/edit');
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<AuditionAvatar type={audition.type} />}
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
        title={
          audition.breakdown.roleName + ' / ' + audition.breakdown.project.name
        }
        subheader={
          <Moment interval={0} format="LLL">
            {audition.auditionTime}
          </Moment>
        }
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
          <Grid container>
            {audition.address && (
              <Grid item xs={6}>
                <Typography variant="h5">Address</Typography>
                <Typography paragraph>{audition?.address?.line1}</Typography>
                <Typography paragraph>{audition?.address?.line2}</Typography>
                <Typography paragraph>{audition?.address?.line3}</Typography>
                <Typography paragraph>
                  {audition?.address?.city}, {audition?.address?.state}{' '}
                  {audition?.address?.zip}
                </Typography>
              </Grid>
            )}
            <Grid item xs={6}>
              {audition.instructions && (
                <>
                  <Typography variant="h5">Instructions</Typography>
                  <Typography paragraph>{audition?.instructions}</Typography>
                </>
              )}
              {audition.participants && audition.participants.length > 0 && (
                <>
                  <Typography variant="h5">Participants</Typography>
                  {audition.participants.map((p) => (
                    <Typography paragraph>{p}</Typography>
                  ))}
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default AuditionCard;
