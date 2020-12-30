import { UnionType, ProjectType, ProjectStatus } from '@makeit/types';
import MUIDataTable from 'mui-datatables';
import React, { useEffect } from 'react';
import { Converter } from '../../app/Converters';
import { createMuiTheme, makeStyles, MuiThemeProvider } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectAuthed } from '../auth/auth.slice';
import {
  selectProjectsLoading,
  selectProjects,
  fetchProjects,
} from './project.slice';
import { useAppDispatch } from '../../app/store';
import { unwrapResult } from '@reduxjs/toolkit';
import { logError } from '../logging/logging.slice';
import IfNotLoading from '../layout/IfNotLoading';
import ProjectCardActions from './ProjectCardActions';

const useStyles = makeStyles((theme) => ({
  padding: {
    marginBottom: '20px',
  },
}));

const options = {
  filtertype: 'checkbox',
  enableNestedDataAccess: '.',
  selectableRows: 'none',
};

const defaultTheme = createMuiTheme();
const theme = createMuiTheme({
  overrides: {
    MuiTableRow: {
      head: {
        '& td:nth-child(3)': {
          textAlign: 'left',
        },
        [defaultTheme.breakpoints.up('md')]: {
          '& th:nth-child(1)': {},
          '& th:nth-child(2)': {
            width: 150,
          },
          '& th:nth-child(3)': {
            width: 150,
          },
          '& th:nth-child(4)': {
            width: 150,
          },
          '& th:nth-child(5)': {
            width: 200,
            textAlign: 'center',
          },
        },
      },
      root: {
        [defaultTheme.breakpoints.up('md')]: {
          '& td:nth-child(1)': {},
          '& td:nth-child(2)': {
            width: 150,
          },
          '& td:nth-child(3)': {
            width: 150,
          },
          '& td:nth-child(4)': {
            width: 150,
          },
          '& td:nth-child(5)': {
            width: 200,
            textAlign: 'right',
          },
        },
      },
    },
  },
});

export const ProjectsList = () => {
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectProjectsLoading);
  const projectsRaw = useSelector(selectProjects);
  const projects = projectsRaw.map((a) => Converter.convertAllDates(a));
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const columns = [
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'projectType',
      label: 'Type',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return Converter.getLabelForEnum(ProjectType, value);
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return Converter.getLabelForEnum(ProjectStatus, value);
        },
      },
    },
    {
      name: 'union',
      label: 'Union Status',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return Converter.getLabelForEnum(UnionType, value);
        },
      },
    },
    {
      name: '_id',
      label: 'Actions',
      options: {
        filter: false,
        sort: false,
        print: false,
        searchable: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <ProjectCardActions
              project={projects.find((a) => a._id === value)}
            />
          );
        },
      },
    },
  ];

  useEffect(() => {
    if (!loading) {
      dispatch(fetchProjects(user?.userId ?? 'notnull'))
        .then(unwrapResult)
        .catch((error) => dispatch(logError(error)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IfNotLoading loading={loading}>
      <div className={classes.padding}>
        <MuiThemeProvider theme={theme}>
          <MUIDataTable
            title="Projects"
            data={projects}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      </div>
    </IfNotLoading>
  );
};

export default ProjectsList;
