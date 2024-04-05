import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';
import { Grid, ListItemButton, ListItemText } from '@mui/material';
import { find, values } from 'lodash';
import Popover from '@mui/material/Popover';
import DateRangePickerComponent from './DateRangePickerComponent';
import { DropdownLabel } from './DropdownLabel';

// eslint-disable-next-line theme-colors/no-literal-colors
const ContentStyleWrapper = styled.div`
  .popper-date-range-picker {
    .popper-date-range-picker__list-item {
      width: 10.71rem;
      border-right: 1px solid #1718191a !important;
      border-bottom: 1px solid #1718191a !important;
    }
    &__calender {
      border-bottom: 1px solid #1718191a !important;
    }
    & .PrivatePickersToolbar-root {
      display: none;
    }
  }

  .footer {
    text-align: right;
    padding: 0.5rem;
  }
`;

export default function PopoverDateRangePicker(props: any) {
  const { timeRangeValueList, localTimeRange, setLocalTimeRange } = props;
  const [groupByTime, setGroupByTime] = useState(props.groupByTime);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClickKatalonPopover = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseKatalonPopover = () => {
    setAnchorEl(null);
  };

  const onSave = () => {
    props.onSave();
    handleCloseKatalonPopover();
  };

  const onHide = () => {
    props.onHide();
    handleCloseKatalonPopover();
  };

  const TestRunDailyGroupByOptions = {
    DAILY: {
      value: 'P1D',
      label: 'Daily',
    },
    WEEKLY: {
      value: 'P1W',
      label: 'Weekly',
    },
    MONTHLY: {
      value: 'P1M',
      label: 'Monthly',
    },
    QUARTERLY: {
      value: 'P3M',
      label: 'Quarterly',
    },
  };

  const resonableTimeRange =
    timeRangeValueList[0] !== null && timeRangeValueList[1] !== null;

  const resonableLocalTimeRange =
    localTimeRange[0] !== null && localTimeRange[1] !== null;

  const overlayContent = (
    <ContentStyleWrapper>
      <Grid container className="popper-date-range-picker d-flex">
        <Grid item className="popper-date-range-picker__list-item">
          {values(TestRunDailyGroupByOptions).map(option => (
            <ListItemButton
              key={option.value}
              onClick={() => setGroupByTime(option.value)}
              selected={option.value === groupByTime}
            >
              <ListItemText primary={option.label} />
            </ListItemButton>
          ))}
        </Grid>
        <Grid item className="popper-date-range-picker__calender">
          <DateRangePickerComponent
            displayStaticWrapperAs="mobile"
            value={localTimeRange}
            onChange={(newValue: any) => {
              setLocalTimeRange(newValue);
            }}
            maxDate={moment()}
            renderInput={null}
          />
        </Grid>
      </Grid>
      <div className="footer">
        <Button color="primary" key="cancel" onClick={onHide}>
          CANCEL
        </Button>
        <Button
          variant="contained"
          color="primary"
          key="apply"
          onClick={onSave}
          disabled={!resonableLocalTimeRange}
        >
          APPLY
        </Button>
      </div>
    </ContentStyleWrapper>
  );

  const groupByLabel = find(values(TestRunDailyGroupByOptions), {
    value: groupByTime,
  })?.label;

  const label = resonableTimeRange
    ? `${groupByLabel} - ${timeRangeValueList[0].format(
        'YYYY-MM-DD',
      )} to ${timeRangeValueList[1].format('YYYY-MM-DD')}`
    : 'No filter';

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const popoverContent = (
    <>
      <DropdownLabel
        onClick={handleClickKatalonPopover}
        label={label}
        isActive={anchorEl !== null}
        isPlaceholder={!resonableTimeRange}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseKatalonPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        {overlayContent}
      </Popover>
    </>
  );

  return <>{popoverContent}</>;
}
