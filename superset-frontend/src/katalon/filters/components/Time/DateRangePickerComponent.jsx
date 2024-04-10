import React from 'react';
import { LocalizationProvider, StaticDateRangePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';

export const DateRangePickerComponent = (props) => (
  <LocalizationProvider dateAdapter={DateAdapter}>
    <StaticDateRangePicker {...props} />
  </LocalizationProvider>
);
