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
import TitledSection from '../layout/TitledSection';
import { AuditionAvatar } from './AuditionAvatar';
import AuditionCardActions from './AuditionCardActions';
import AddressDisplay from '../controls/AddressDisplay';
import AuditionNoteDisplay from './AuditionNoteDisplay';
import ConditionalTooltip from '../controls/ConditionalTooltip';

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
  detailSection: {
    marginTop: theme.spacing(2),
  },
  titleCell: {
    paddingTop: 5,
    paddingRight: theme.spacing(2),
  },
  attachmentIcons: {
    paddingTop: theme.spacing(1)
  }
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

    return (
      <Grid container>
        <Grid item className={classes.titleCell}>
          <Typography variant="body2" color="textPrimary">
            {result}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {audition.auditionTime && (
              <Moment interval={0} format="LLL">
                {audition.auditionTime}
              </Moment>
            )}
            {!audition.auditionTime && 'No date set'}
          </Typography>
        </Grid>
        {(audition.attachments?.length > 0 ||
          audition.links?.length > 0 ||
          audition.participants?.length > 0) && (
          <Grid item className={classes.attachmentIcons}>
            <Grid container spacing={2}>
              {audition.attachments?.length > 0 && (
                <Grid item>
                  <FileAttachmentMenu container={audition} iconOnly />
                </Grid>
              )}
              {audition.links?.length > 0 && (
                <Grid item>
                  <LinkAttachmentMenu container={audition} iconOnly />
                </Grid>
              )}
              {audition.participants?.length > 0 && (
                <Grid item>
                  <ParticipantAttachmentMenu container={audition} iconOnly />
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    );
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
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container spacing={2}>
            {(audition.instructions ||
              audition?.breakdown?.roleName ||
              audition?.breakdown?.project?.name) && (
              <Grid item xs={12} sm={6}>
                <TitledSection title="Details" variant="body2">
                  <section>
                    {audition?.breakdown?.roleName && (
                      <ConditionalTooltip
                        title={audition?.breakdown?.roleDescription}
                      >
                        <Typography variant="body2">
                          {audition?.breakdown?.roleName}{' '}
                          {audition.breakdown?.roleType &&
                            '(' + audition?.breakdown?.roleType + ')'}
                        </Typography>
                      </ConditionalTooltip>
                    )}
                    {audition?.breakdown?.project?.name && (
                      <ConditionalTooltip
                        title={audition?.breakdown?.project?.description}
                      >
                        <Typography variant="body2">
                          {audition?.breakdown?.project?.name}
                        </Typography>
                      </ConditionalTooltip>
                    )}
                  </section>
                  <section className={classes.detailSection}>
                    <Typography variant="body2">
                      {audition?.instructions}
                    </Typography>
                  </section>
                </TitledSection>
              </Grid>
            )}
            {audition.address && audition.address.line1 && (
              <Grid item xs={12} sm={6}>
                <TitledSection title="Address" variant="body2">
                  <AddressDisplay address={audition.address} variant="body2" />
                </TitledSection>
              </Grid>
            )}
            {audition.notes?.length > 0 && (
              <Grid item xs={12}>
                <TitledSection title="Notes" variant="body2">
                  {audition.notes.map((note, index) => (
                    <AuditionNoteDisplay note={note} key={note._id} />
                  ))}
                </TitledSection>
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
