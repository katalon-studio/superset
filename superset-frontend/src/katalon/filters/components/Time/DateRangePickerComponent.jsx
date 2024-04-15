import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

export const DateRangePickerComponent = props => (
  <LocalizationProvider dateAdapter={AdapterMoment}>
    <StaticDateRangePicker {...props} />
  </LocalizationProvider>
);
