import React from 'react';
import { LocalizationProvider, StaticDateRangePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';

export default function DateRangePickerComponent(props) {

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <StaticDateRangePicker
        {...props}
      />
    </LocalizationProvider>
  );
}
