import { AuditionType, Audition } from '@makeit/types';
import * as moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React from 'react';
import { Converter } from '../../app/Converters';
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core';
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
        return value ? moment.default(value).format('LLL') : 'Not set';
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
        return (
          <AuditionCardActions
            audition={auditions.find((a) => a._id === value)}
          />
        );
      },
    },
  },
];

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
        [defaultTheme.breakpoints.up('md')]: {
          '& th:nth-child(1)': {
            width: 150,
          },
          '& th:nth-child(2)': {
            width: 200,
          },
          '& th:nth-child(3)': {
          },
          '& th:nth-child(4)': {
            width: 200,
          },
          '& th:nth-child(5)': {
            width: 150,
          },
          '& th:nth-child(6)': {
            width: 200,
            textAlign: 'center',
          },
        },
      },
      root: {
        [defaultTheme.breakpoints.up('md')]: {
          '& td:nth-child(1)': {
            width: 150,
          },
          '& td:nth-child(2)': {
            width: 200,
          },
          '& td:nth-child(3)': {
          },
          '& td:nth-child(4)': {
            width: 200,
          },
          '& td:nth-child(5)': {
            width: 150,
          },
          '& td:nth-child(6)': {
            width: 200,
            textAlign: 'right',
          },
        },
      },
    },
  },
});

export const AuditionsList = (props) => {
  const { auditions } = props;
  const classes = useStyles();

  return (
    <div className={classes.padding}>
      <MuiThemeProvider theme={theme}>
        <MUIDataTable
          title="Auditions"
          data={auditions}
          columns={columns(auditions)}
          options={options}
        />
      </MuiThemeProvider>
    </div>
  );
};

export default AuditionsList;
