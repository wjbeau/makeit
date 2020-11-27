import { Container, makeStyles } from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { selectAuthed } from '../auth/auth.slice';
import Loading from '../layout/Loading';
import { logError } from '../message/message.slice';
import { fetchMeetings, selectMeetingsLoading, selectMeetings } from './meetings.slice';
import { DataGrid } from '@material-ui/data-grid';
import classes from '*.module.css';

const useStyles = makeStyles(
  {
    flexContainer: {
      display: 'flex',
      height: '100%'
    },
    flexItem: {
      flexGrow: 1
    }
  }
)
const columns = [
  { field: 'startDate', headerName: 'Date', width: 100 },
  { field: 'type', headerName: 'Type', width: 100 },
  { field: 'subject', headerName: 'Subject', width: 250 },
  { field: 'location', headerName: 'Location', width: 200, valueGetter: (params:any) => `${params.getValue('location') || ''}`},
];

export const Meetings = () => {
  const classes = useStyles();
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectMeetingsLoading)
  const meetings = useSelector(selectMeetings)
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMeetings(user?.userId ?? "notnull"))
      .then(unwrapResult)
      .catch(error => dispatch(logError(error)))
  }, [dispatch, user?.userId])
   
  return (
    <>
      {loading && <Loading />}
      {!loading && 
        <DataGrid rows={meetings} columns={columns} pageSize={10} />
      }
    </>
  );
}

export default Meetings;
