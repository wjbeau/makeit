import { Box, Typography } from '@material-ui/core';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TabPanel = (props: any) => {
  const { children, value, index, tabId, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${tabId}-tabpanel-${index}`}
      aria-labelledby={`${tabId}-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default TabPanel;
