import {
  AddressType,
  Contact,
  ContactLinkType,
  ContactUtils,
  Telecom,
  TelecomType,
} from '@makeit/types';
import {
  Avatar,
  Grid,
  IconButton,
  Link,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import {
  Call,
  Delete,
  Edit,
  Email,
  Facebook,
  Instagram,
  Link as LinkIcon,
  LinkedIn,
  PermContactCalendar,
  Pinterest,
  Twitter,
  YouTube,
} from '@material-ui/icons';
import React, { useState } from 'react';
import { SERVER_URL } from '../../app/config';
import { Converter } from '../../app/Converters';
import AddressDisplay from '../controls/AddressDisplay';
import ImdbIcon from '../controls/icons/ImdbIcon';
import TextWithAction from '../controls/TextWithAction';
import TitledSection from '../layout/TitledSection';
import { useAppDispatch } from '../../app/store';
import { deleteContact } from './contact.slice';
import { unwrapResult } from '@reduxjs/toolkit';
import { logError } from '../logging/logging.slice';
import { useHistory } from 'react-router-dom';
import VimeoIcon from 'mdi-react/VimeoIcon';
import SkypeIcon from 'mdi-react/SkypeIcon';

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
    minWidth: 200,
  },
  menuIcon: {
    marginRight: theme.spacing(2),
  },
  delete: {
    color: theme.palette.error.dark
  },
  deleteMenu: {
    marginTop: theme.spacing(4)
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
      return <VimeoIcon />;
  }
};

const toSafeUrl = (url: string) => {
  if (!url) {
    return null;
  }
  if (
    !url.toLowerCase().startsWith('http://') &&
    !url.toLowerCase().startsWith('https://')
  ) {
    return 'http://' + url;
  } else {
    return url;
  }
};

const remotify = (url: string) => {
  if (url && url.startsWith('data:')) {
    return url;
  } else if (url) {
    return SERVER_URL + '/files/' + url;
  }

  return null;
};

export const ContactDetails = (props: {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
}) => {
  const { contact, onEdit, onDelete } = props;
  const classes = useStyles();
  const socials = contact.links?.filter((l) =>
    ContactUtils.isSocialMedia(l.type)
  );
  const [callAnchor, setCallAnchor] = useState(null);
  const [emailAnchor, setEmailAnchor] = useState(null);
  const [deleteAnchor, setDeleteAnchor] = useState(null);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const phones = contact.telecoms?.filter((t) => ContactUtils.isPhone(t.type));
  const emails = contact.telecoms?.filter((t) => ContactUtils.isEmail(t.type));

  const invokeContact = (link: string) => {
    window.location.href = link;
  };

  const handleShowDelete = (evt) => {
    setDeleteAnchor(evt.currentTarget);
  };

  const handleDelete = () => {
    dispatch(deleteContact(contact))
      .then(unwrapResult)
      .then((d) => {
        onDelete(contact);
      })
      .catch((err) => {
        dispatch(logError(err));
      });
  };

  const handleCall = (event) => {
    if (phones.length > 1) {
      setCallAnchor(event.currentTarget);
    } else {
      invokeContact('tel:' + phones[0].details);
    }
  };
  const handleCallClick = (tel: Telecom) => {
    setCallAnchor(null);
    invokeContact('tel:' + tel.details);
  };

  const handleEmail = (event) => {
    if (emails.length > 1) {
      setEmailAnchor(event.currentTarget);
    } else {
      invokeContact('mailto:' + emails[0].details);
    }
  };

  const handleEmailClick = (tel: Telecom) => {
    setEmailAnchor(null);
    invokeContact('mailto:' + tel.details);
  };

  return (
    <Grid container spacing={3} direction="row">
      <Grid item xs={12}>
        <Grid container spacing={1} direction="row">
          <Grid item className={classes.headingAvatar}>
            <Avatar
              src={remotify(contact.avatar)}
              className={classes.mainAvatar}
            >
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
              {onEdit && (
                <IconButton onClick={() => onEdit(contact)}>
                  <Edit />
                </IconButton>
              )}
              {phones.length > 0 && (
                <>
                  <IconButton onClick={handleCall}>
                    <Call />
                  </IconButton>
                  {phones.length > 1 && (
                    <Menu
                      id="call-menu"
                      anchorEl={callAnchor}
                      keepMounted
                      open={callAnchor !== null}
                      onClose={() => setCallAnchor(null)}
                    >
                      {phones.map((e) => (
                        <MenuItem
                          onClick={() => handleCallClick(e)}
                          key={e.details}
                        >
                          <Call className={classes.menuIcon} />{' '}
                          {Converter.getLabelForEnum(TelecomType, e.type)}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                </>
              )}
              {emails.length > 0 && (
                <>
                  <IconButton onClick={handleEmail}>
                    <Email />
                  </IconButton>
                  {emails.length > 1 && (
                    <Menu
                      id="email-menu"
                      anchorEl={emailAnchor}
                      keepMounted
                      open={emailAnchor !== null}
                      onClose={() => setEmailAnchor(null)}
                    >
                      {emails.map((e) => (
                        <MenuItem
                          onClick={() => handleEmailClick(e)}
                          key={e.details}
                        >
                          <Email className={classes.menuIcon} />{' '}
                          {Converter.getLabelForEnum(TelecomType, e.type)}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                </>
              )}
              {onDelete && (
                <>
                  <IconButton onClick={handleShowDelete}>
                    <Delete />
                  </IconButton>
                  <Menu
                    anchorEl={deleteAnchor}
                    keepMounted
                    open={!!deleteAnchor}
                    onClose={() => setDeleteAnchor(null)}
                    className={classes.deleteMenu}
                  >
                    <MenuItem onClick={handleDelete} className={classes.delete}>
                      <Delete className={classes.menuIcon} /> Delete
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
      {contact.telecoms?.length > 0 && (
        <Grid item xs={12} sm={6}>
          <TitledSection title="Contacts">
            {contact.telecoms?.length > 0 && (
              <div>
                {contact.telecoms.map((s, index) => {
                  let url = s.details;
                  let icon = <PermContactCalendar />;
                  if (ContactUtils.isPhone(s.type)) {
                    url = 'tel:' + s.details;
                    icon = <Call />;
                  } else if (ContactUtils.isEmail(s.type)) {
                    url = 'mailto:' + s.details;
                    icon = <Email />;
                  }
                  else if(TelecomType.Skype === s.type) {
                    url = 'skype:' + s.details;
                    icon = <SkypeIcon />;
                  }
                  return (
                    <TextWithAction
                      icon={icon}
                      label={Converter.getLabelForEnum(TelecomType, s.type)}
                      href={url}
                      key={index}
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
            {contact.links?.length > 0 && (
              <div>
                {contact.links.map((s, index) => {
                  let icon = <LinkIcon />;
                  if (ContactUtils.isSocialMedia(s.type)) {
                    icon = iconForSocial(s.type);
                  }
                  return (
                    <TextWithAction
                      icon={icon}
                      label={Converter.getLabelForEnum(ContactLinkType, s.type)}
                      href={s.url}
                      key={index}
                    >
                      <Link href={toSafeUrl(s.url)} target="_blank">
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
              {contact.addresses.map((addr, index) => (
                <Grid item className={classes.address} key={index}>
                  <Typography variant="body1" display="block">
                    {Converter.getLabelForEnum(AddressType, addr.type)}
                  </Typography>
                  <AddressDisplay variant="body2" address={addr.address} />
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

export default ContactDetails;
