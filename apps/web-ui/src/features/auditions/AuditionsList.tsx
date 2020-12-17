import { AuditionType, Audition } from '@makeit/types';
import * as moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React from 'react';
import { Converter } from '../../app/Converters';
import { makeStyles } from '@material-ui/core';
import AuditionCardActions from './AuditionCardActions';

const useStyles = makeStyles((theme) => ({
  padding: {
    marginBottom: '20px',
  },
}));

const columns = (auditions: Audition[]) => [
  {
    name: 'breakdown.roleName',
    label: 'Role',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'breakdown.project.name',
    label: 'Project',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'instructions',
    label: 'Instructions',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'auditionTime',
    label: 'Date / Time',
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return value ? moment.default(value).format("LLL") : "Not set";
      },
    },
  },
  {
    name: 'type',
    label: 'Type',
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return Converter.getLabelForEnum(AuditionType, value);
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
        return <AuditionCardActions audition={auditions.find(a => a._id === value)} />
      },
    },
  },
];

const options = {
  filtertype: 'checkbox',
  enableNestedDataAccess: '.',
  selectableRows: 'none'
};

export const AuditionsList = (props) => {
  const { auditions } = props;
  const classes = useStyles();

  return (
    <div className={classes.padding}>
      <MUIDataTable
        title="Auditions"
        data={auditions}
        columns={columns(auditions)}
        options={options}
      />
    </div>
  );
};

export default AuditionsList;
