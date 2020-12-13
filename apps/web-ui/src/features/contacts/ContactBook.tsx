import { PersonInfo, Contact } from '@makeit/types';
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
import ContactsDetails from './ContactDetails';

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
    height: '100%'
  },
  accordionItem: {
    padding: theme.spacing(0)
  }
}));

export const ContactBook = () => {
  const [active, setActive] = useState<string>('');
  const [contact, setContact] = useState<Contact>();
  const [createNew, setCreateNew] = useState<boolean>();
  const [search, setSearch] = useState<string>('');
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectContactsLoading);
  const contacts = useSelector(selectContacts);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const categories = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchesSearch = (contact: any) => {
    if (search && search.length) {
      return (
        _.values(contact).filter((v) => {
          if(_.isString(v)) {
            return v.toLowerCase().indexOf(search) >= 0
          }
          if(_.isArray(v)) {
            return v.findIndex(v2 => matchesSearch(v2)) >= 0
          }
          else {
            return matchesSearch(v)
          }
        }
      )).length > 0;
    } else {
      return true;
    }
  };

  contacts
    .filter((c) => matchesSearch(c))
    .forEach((c) => {
      const letter = c.lastName.charAt(0).toUpperCase();
      if (!categories[letter]) {
        categories[letter] = [];
      }
      categories[letter].push(c);
    });

  const selectFirst = () => {
    const keys = Object.keys(categories);
    if (keys.length) {
      setActive(keys[0]);
      setContact(categories[keys[0]][0]);
    } else {
      setActive('');
    }
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setActive(panel);
  };

  const handleSearchChange = (event) => {
    setSearch(event?.target?.value.toLowerCase());
    selectFirst();
  };
  const handleAddContact = () => {
    setActive(null);
    setCreateNew(true);
  };

  useEffect(() => {
    if (!contacts.length && !loading) {
      dispatch(fetchContacts(user?.userId ?? 'notnull'))
        .then(unwrapResult)
        .then(selectFirst())
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
                        selectFirst();
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
      </Grid>
      <Grid item xs={3}>
        <IfNotLoading loading={loading}>
          {Object.keys(categories).map((item, index) => (
            <Accordion
              expanded={active === item}
              onChange={handleChange(item)}
              key={item}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${item}-content`}
                id={`${item}-header`}
              >
                <Typography className={classes.heading}>{item}</Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.accordionItem}>
                <List className={classes.contactList} disablePadding={true}>
                  {categories[item].map((c, index2) => {
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
                        onClick={() => setContact(c)}
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
          {Object.keys(categories).length === 0 && (
            <NothingToShow message="No matching contacts" />
          )}
        </IfNotLoading>
      </Grid>
      <Grid item xs={9} className={classes.contentArea}>
        <Paper className={classes.paper}>
          {contacts.map((c) => (
            <TabPanel value={contact} index={c} key={c._id}>
              <ContactsDetails contact={c} />
            </TabPanel>
          ))}
          <TabPanel value={createNew} index={true}>
            New Contact
          </TabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ContactBook;
