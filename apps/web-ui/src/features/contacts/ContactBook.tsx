import { ModelFactory, Contact } from '@makeit/types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Clear, ExpandMore, PersonAdd, Search } from '@material-ui/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { selectAuthed } from '../auth/auth.slice';
import IfNotLoading from '../layout/IfNotLoading';
import TabPanel from '../layout/TabPanel';
import { logError } from '../logging/logging.slice';
import {
  fetchContacts,
  selectContacts,
  selectContactsLoading,
} from './contact.slice';
import * as _ from 'lodash';
import NothingToShow from '../layout/NothingToShow';
import { Paper } from '@material-ui/core';
import { Converter } from '../../app/Converters';
import ContactDetails from './ContactDetails';
import ContactEdit from './ContactEdit';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: theme.typography.caption.fontSize,
    marginLeft: '-1px',
  },
  ellipsis: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  addButton: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  contactList: {
    width: '100%',
  },
  contentArea: {
    position: 'relative',
  },
  searchbox: {
    marginRight: theme.spacing(1),
    width: '25ch',
  },
  actions: {
    display: 'inline-block',
    float: 'right',
  },
  paper: {
    flexGrow: 1,
    padding: theme.spacing(3),
    height: '100%',
  },
  accordionItem: {
    padding: theme.spacing(0),
  },
}));

export const ContactBook = () => {
  const [activeLetter, setActiveLetter] = useState<string>('');
  const [contact, setContact] = useState<Contact>();
  const [editContact, setEditContact] = useState<Contact>();
  const [search, setSearch] = useState<string>('');
  const [letters, setLetters] = useState([]);
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectContactsLoading);
  const contacts = useSelector(selectContacts);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const contactsForLetter = (letter: string) => {
    return contacts
      .filter(c => c.lastName.toUpperCase().startsWith(letter))
      .filter(c => matchesSearch(c))
      .sort((a,b) => a.lastName.localCompare(b.lastName));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchesSearch = (contact: any) => {
    if (search && search.length) {
      return (
        _.values(contact).filter((v) => {
          if (_.isString(v)) {
            return v.toLowerCase().indexOf(search) >= 0;
          }
          if (_.isArray(v)) {
            return v.findIndex((v2) => matchesSearch(v2)) >= 0;
          } else {
            return matchesSearch(v);
          }
        }).length > 0
      );
    } else {
      return true;
    }
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setActiveLetter(panel);
  };

  const handleSearchChange = (event) => {
    setSearch(event?.target?.value.toLowerCase());
    setContact(null);
  };
  const handleAddContact = () => {
    const contact = ModelFactory.createEmptyContact();
    handleEditContact(contact);
  };
  const handleEditContact = (contact: Contact) => {
    setEditContact(contact);
  };
  const handleEditSave = (contact: Contact) => {
    setEditContact(null);
    setContact(contact);
  };

  const handleEditCancel = () => {
    setEditContact(null);
    setContact(contact);
  };

  useEffect(() => {
    let newLetters = contacts
      .filter((c) => matchesSearch(c))
      .map(c => c.lastName?.charAt(0).toUpperCase())
      .sort((a,b) => a.localeCompare(b))
    
    newLetters = _.uniq(newLetters);
    setLetters(newLetters);
    setContact(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts, search]);

  useEffect(() => {
    let newCtx = contact;
    if(newCtx === null && contacts.length) {
      newCtx = contacts
        .filter((c) => matchesSearch(c))
        .sort((a,b) => a.lastName.localeCompare(b.lastName))[0]
    }
    setActiveLetter(newCtx?.lastName.charAt(0).toUpperCase())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact]);

  useEffect(() => {
    if (!loading) {
      dispatch(fetchContacts(user?._id ?? 'notnull'))
        .then(unwrapResult)
        .then((data) => setContact(null))
        .catch((error) => dispatch(logError(error)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" display="inline">
          Contacts
        </Typography>
        {!editContact && (
          <div className={classes.actions}>
            <TextField
              className={classes.searchbox}
              size="small"
              id="search-field"
              value={search}
              variant="outlined"
              label="Search"
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {search?.length <= 0 && <Search />}
                    {search?.length > 0 && (
                      <IconButton
                        aria-label="search"
                        onClick={() => {
                          setSearch('');
                        }}
                        edge="end"
                      >
                        <Clear />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAdd />}
              onClick={handleAddContact}
            >
              New Contact
            </Button>
          </div>
        )}
      </Grid>
      <Grid item xs={3}>
        <IfNotLoading loading={loading}>
          {letters.map((letter, index) => (
            <Accordion
              expanded={activeLetter === letter}
              onChange={handleChange(letter)}
              key={letter}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${letter}-content`}
                id={`${letter}-header`}
              >
                <Typography className={classes.heading}>{letter}</Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.accordionItem}>
                <List className={classes.contactList} disablePadding={true}>
                  {contactsForLetter(letter).map((c, index2) => {
                    const avatar = c.avatar ? (
                      <Avatar src={c.avatar} className={classes.small}></Avatar>
                    ) : (
                      <Avatar className={classes.small}>
                        {Converter.getInitials(c)}
                      </Avatar>
                    );
                    return (
                      <ListItem
                        key={c._id}
                        onClick={() => {
                          setContact(c);
                          setEditContact(null);
                        }}
                        button
                      >
                        <ListItemAvatar>{avatar}</ListItemAvatar>
                        <ListItemText
                          primary={c.firstName + ' ' + c.lastName}
                          secondary={c.description}
                          classes={{
                            primary: classes.ellipsis,
                            secondary: classes.ellipsis,
                          }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
          {letters.length === 0 && (
            <NothingToShow message="No matching contacts" />
          )}
        </IfNotLoading>
      </Grid>
      <Grid item xs={9} className={classes.contentArea}>
        <Paper className={classes.paper}>
          {!editContact &&
            contacts.map((c) => (
              <TabPanel value={contact} index={c} key={c._id}>
                <ContactDetails contact={c} onEdit={handleEditContact} />
              </TabPanel>
            ))}
          {editContact && (
            <ContactEdit contact={editContact} onCancel={handleEditCancel} onSave={handleEditSave} />
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ContactBook;
