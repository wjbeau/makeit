import {
  Transaction,
  TransactionType,
  TransactionRelationType,
} from '@makeit/types';
import {
  createMuiTheme,
  IconButton,
  makeStyles,
  MuiThemeProvider,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import * as moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React, { useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { Converter } from '../../app/Converters';
import { useAppDispatch } from '../../app/store';
import FileAttachmentMenu from '../attachments/FileAttachmentMenu';
import LinkAttachmentMenu from '../attachments/LinkAttachmentMenu';
import { selectAuthed } from '../auth/auth.slice';
import DeleteWithConfirm from '../controls/DeleteWithConfirm';
import IfNotLoading from '../layout/IfNotLoading';
import { logError, logSuccess } from '../logging/logging.slice';
import {
  deleteTransaction,
  fetchTransactions,
  selectTransactions,
  selectTransactionsLoading,
} from './finance.slice';

const useStyles = makeStyles((theme) => ({
  padding: {
    marginBottom: '20px',
  },
  negative: {
    color: theme.palette.error.dark,
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
          '& th:nth-child(1)': {
            width: 150,
          },
          '& th:nth-child(2)': {
            width: 150,
          },
          '& th:nth-child(3)': {
            width: 150,
          },
          '& th:nth-child(4)': {},
          '& th:nth-child(5)': {
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
            width: 150,
          },
          '& td:nth-child(3)': {
            width: 150,
            textAlign: 'right',
          },
          '& td:nth-child(4)': {},
          '& td:nth-child(5)': {
            width: 200,
            textAlign: 'right',
          },
        },
      },
      footer: {
        '& td:nth-child(4)': {
          textAlign: 'right',
        },
      },
    },
  },
});

export const TransactionsList = (props: {
  related?;
  relatedType?: TransactionRelationType;
}) => {
  const user = useSelector(selectAuthed);
  const loading = useSelector(selectTransactionsLoading);
  const transactionsRaw = useSelector(selectTransactions);
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const { related, relatedType } = props;

  const transactions = transactionsRaw.filter(
    (t) =>
      (!related || t.relatesTo === related._id) &&
      (!relatedType || t.relatesToType === relatedType)
  );

  const sumAmount = (startIndex, endIndex) => {
    return transactions
      .slice(startIndex, endIndex)
      .map((a) => (a.type === TransactionType.Expense ? -a.amount : a.amount))
      .reduce((total, amount) => (total += amount), 0);
  };

  const deleteTx = (tx: Transaction) => {
    dispatch(deleteTransaction(tx._id))
      .then(unwrapResult)
      .then((d) => dispatch(logSuccess({ message: 'Successfully deleted.' })))
      .catch((e) => dispatch(logError(e)));
  };

  const options = {
    filter: true,
    selectableRows: 'none',
    filterType: 'dropdown',
    rowsPerPage: 5,

    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
      const startIndex = page * rowsPerPage;
      const endIndex = (page + 1) * rowsPerPage;
      return (
        <TableFooter>
          <TableRow>
            <TableCell>
              <Typography
                variant="body2"
                color="textPrimary"
                style={{ fontWeight: 'bold' }}
              >
                Total
              </Typography>
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textPrimary"
                style={{ fontWeight: 'bold' }}
              >
                <NumberFormat
                  thousandSeparator
                  prefix="$"
                  displayType={'text'}
                  value={sumAmount(startIndex, endIndex)}
                />
              </Typography>
            </TableCell>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={2}
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={(e, p) => changePage(p)}
              onChangeRowsPerPage={(e) => changeRowsPerPage(e.target.value)}
            />
          </TableRow>
        </TableFooter>
      );
    },
  };

  const columns = [
    {
      name: 'type',
      label: 'Type',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return Converter.getLabelForEnum(TransactionType, value);
        },
      },
    },
    {
      name: 'date',
      label: 'Date',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const date = new Date(value);
          return moment.default(date).format('MM/DD/YYYY');
        },
      },
    },
    {
      name: 'amount',
      label: 'Amount',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const v =
            transactions[tableMeta.rowIndex].type === TransactionType.Expense
              ? -value
              : value;
          const clz = v < 0 ? classes.negative : null;
          return (
            <NumberFormat
              thousandSeparator
              prefix="$"
              displayType={'text'}
              value={v}
              className={clz}
            />
          );
        },
      },
    },
    {
      name: 'description',
      label: 'Description',
      options: {
        filter: false,
        sort: true,
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
          const tx = transactions.find((t) => t._id === value);
          return (
            <>
              {tx.attachments?.length > 0 && (
                <FileAttachmentMenu container={tx} iconOnly readOnly />
              )}
              {tx.links?.length > 0 && (
                <LinkAttachmentMenu container={tx} iconOnly readOnly />
              )}
              <DeleteWithConfirm onDelete={() => deleteTx(tx)} />
            </>
          );
        },
      },
    },
  ];

  useEffect(() => {
    if (!loading) {
      dispatch(fetchTransactions(user?.userId ?? 'notnull'))
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
            title=""
            data={transactions}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      </div>
    </IfNotLoading>
  );
};

export default TransactionsList;
