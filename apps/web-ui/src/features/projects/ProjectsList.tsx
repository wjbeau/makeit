import { AuditionType } from '@makeit/types';
import * as moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React, { useEffect } from 'react';
import { Converter } from '../../app/Converters';
import { makeStyles } from '@material-ui/core';
import {
  UnionType,
  ProjectType,
  ProjectStatus,
} from '../../../../../libs/types/src/project.model';
import { Edit } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { selectAuthed } from '../auth/auth.slice';
import {
  selectProjectsLoading,
  selectProjects,
  fetchProjects,
} from './project.slice';
import { useAppDispatch } from '../../app/store';
import { useHistory } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import { logError } from '../logging/logging.slice';
import IfNotLoading from '../layout/IfNotLoading';

const useStyles = makeStyles((theme) => ({
  padding: {
    marginBottom: '20px',
  },
}));

const columns = [
  {
    name: 'ame',
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
        return <Edit />; //<ProjectButtons id={value} />
      },
    },
  },
];

const options = {
  filtertype: 'checkbox',
  enableNestedDataAccess: '.',
  selectableRows: 'none',
};

export const ProjectsList = () => {
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectProjectsLoading);
  const projectsRaw = useSelector(selectProjects);
  const projects = projectsRaw.map((a) => Converter.convertAllDates(a));
  const dispatch = useAppDispatch();
  const classes = useStyles();

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
        <MUIDataTable
          title="Projects"
          data={projects}
          columns={columns}
          options={options}
        />
      </div>
    </IfNotLoading>
  );
};

export default ProjectsList;
