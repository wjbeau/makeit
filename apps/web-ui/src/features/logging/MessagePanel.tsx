import { Slide, Snackbar, makeStyles } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { messagesHandled, selectMessages } from '../logging/logging.slice';
import { LogMessage } from '../../../../../libs/types/src/logging.model';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} {...props} />;
}

const useStyles = makeStyles((theme) => ({
  alertContainer: {
    position: 'fixed',
    margin: theme.spacing(3) + 'px 0',
    zIndex: theme.zIndex.drawer + 2,
    width: "100vw"
  },
  alertInner: {
    maxWidth: '50vw',
    margin: '0 auto',
  },
}));

export const MessagePanel = () => {
  const dispatch = useAppDispatch();
  const messages = useSelector(selectMessages);
  const classes = useStyles();

  const handleSingleClose = (m: LogMessage) => {
    dispatch(messagesHandled([m]));
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {messages && messages.length > 0 && (
        <div className={classes.alertContainer}>
          <div className={classes.alertInner}>
            {messages.map((message) => (
              <Alert
                onClose={() => handleSingleClose(message)}
                severity={message.type}
                key={message.message}
              >
                {message.message}
              </Alert>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MessagePanel;
