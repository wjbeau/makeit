import React from 'react';
import { Contact, ContactUtils, ContactLinkType, AddressType, TelecomType } from '@makeit/types';
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  makeStyles,
  SvgIcon,
  Tooltip,
  Typography,
  Link,
} from '@material-ui/core';
import { Converter } from '../../app/Converters';
import {
  Call,
  Edit,
  Email,
  Facebook,
  Instagram,
  LinkedIn,
  PermContactCalendar,
  Pinterest,
  Twitter,
  YouTube,
} from '@material-ui/icons';
import TitledSection from '../layout/TitledSection';
import TextWithAction from '../controls/TextWithAction';
import { mdiVimeo as Vimeo } from '@mdi/js';
import ImdbIcon from '../controls/icons/ImdbIcon';
import AddressDisplay from '../controls/AddressDisplay';

const useStyles = makeStyles((theme) => ({
  mainAvatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginRight: theme.spacing(2),
  },
  headingAvatar: {
    flexGrow: 0,
  },
  headingTitles: {
    flexGrow: 1,
  },
  headingTitleMain: {},
  headingTitleSecondary: {},
  headingTitleTertiary: {},
  headingActions: {
    flexGrow: 0,
  },
  address: {
      minWidth: 200
  },
  socials: {
      marginTop: '2rem',
      textAlign: 'right'
  }
}));

const iconForSocial = (val: ContactLinkType) => {
  switch (val) {
    case ContactLinkType.Facebook:
      return <Facebook />;
    case ContactLinkType.Instagram:
      return <Instagram />;
    case ContactLinkType.LinkedIn:
      return <LinkedIn />;
    case ContactLinkType.IMDb:
      return <ImdbIcon />;
    case ContactLinkType.YouTube:
      return <YouTube />;
    case ContactLinkType.Pintrest:
      return <Pinterest />;
    case ContactLinkType.Twitter:
      return <Twitter />;
    case ContactLinkType.Vimeo:
      return <Vimeo />;
  }
};

export const ContactsDetails = (props: { contact: Contact }) => {
  const { contact } = props;
  const classes = useStyles();
  const socials = contact.links?.filter((l) =>
    ContactUtils.isSocialMedia(l.type)
  );
  return (
    <Grid container spacing={3} direction="row">
      <Grid item xs={12}>
        <Grid container spacing={1} direction="row">
          <Grid item className={classes.headingAvatar}>
            <Avatar src={contact.avatar} className={classes.mainAvatar}>
              {Converter.getInitials(contact)}
            </Avatar>
          </Grid>
          <Grid item className={classes.headingTitles}>
            <Typography
              variant="h5"
              component="h2"
              className={classes.headingTitleMain}
            >
              {contact.firstName} {contact.lastName}
            </Typography>
            {contact.jobTitle && (
              <Typography
                variant="body1"
                component="p"
                className={classes.headingTitleSecondary}
              >
                {contact.jobTitle}
              </Typography>
            )}
            {contact.company && (
              <Typography
                variant="body1"
                component="p"
                className={classes.headingTitleSecondary}
              >
                {contact.company}
              </Typography>
            )}
            {contact.description && (
              <Typography
                variant="body1"
                component="p"
                className={classes.headingTitleTertiary}
              >
                {contact.description}
              </Typography>
            )}
          </Grid>
          <Grid item className={classes.headingActions}>
            <div>
                <IconButton>
                <Edit />
                </IconButton>
                <IconButton>
                <Call />
                </IconButton>
                <IconButton>
                <Email />
                </IconButton>
            </div>
            {socials?.length > 0 && (
              <div className={classes.socials}>
                {socials.map((s) => (
                  <Tooltip
                    title={Converter.getLabelForEnum(ContactLinkType, s.type)}
                    key={s.type}
                  >
                    <IconButton onClick={() => window.open(s.url, '_blank')}>
                      {iconForSocial(s.type)}
                    </IconButton>
                  </Tooltip>
                ))}
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
      {contact.telecoms?.length > 0 && (
        <Grid item xs={12} sm={6}>
          <TitledSection title="Contacts">
            {contact.telecoms?.length > 0 && (
              <div>
                {contact.telecoms.map((s) => {
                  let url = s.details;
                  let icon = <PermContactCalendar />;
                  if (ContactUtils.isPhone(s.type)) {
                    url = 'tel:' + s.details;
                    icon = <Call />;
                  } else if (ContactUtils.isEmail(s.type)) {
                    url = 'mailto:' + s.details;
                    icon = <Email />;
                  }
                  return (
                    <TextWithAction
                      icon={icon}
                      label={Converter.getLabelForEnum(TelecomType, s.type)}
                      href={url}
                    >
                      <Link href={url} target="_blank">
                        {s.details}
                      </Link>
                    </TextWithAction>
                  );
                })}
              </div>
            )}
          </TitledSection>
        </Grid>
      )}
      {contact.links?.length > 0 && (
        <Grid item xs={12} sm={6}>
          <TitledSection title="Links">
            {contact.links?.filter((l) => !ContactUtils.isSocialMedia(l.type))
              .length > 0 && (
              <div>
                {contact.links.map((s) => {
                    return (
                      <TextWithAction
                        icon={<Link />}
                        label={Converter.getLabelForEnum(
                          ContactLinkType,
                          s.type
                        )}
                        href={s.url}
                      >
                        <Link href={s.url} target="_blank">
                          {s.url}
                        </Link>
                      </TextWithAction>
                    );
                  })}
              </div>
            )}
          </TitledSection>
        </Grid>
      )}
      {contact.addresses?.length > 0 && (
        <Grid item xs={12} sm={6}>
          <TitledSection title="Addresses">
            <Grid container spacing={3}>
              {contact.addresses.map((addr) => (
                <Grid item className={classes.address}>
                  <Typography variant="body1"  display='block'>
                    {Converter.getLabelForEnum(AddressType, addr.type)}
                  </Typography>
                  <AddressDisplay variant='body2' address={addr.address} />
                </Grid>
              ))}
            </Grid>
          </TitledSection>
        </Grid>
      )}
      {contact.note?.length > 0 && (
        <Grid item xs={12} sm={6}>
          <TitledSection title="Notes">
            <Typography variant="body2">{contact.note}</Typography>
          </TitledSection>
        </Grid>
      )}
    </Grid>
  );
};

export default ContactsDetails;
