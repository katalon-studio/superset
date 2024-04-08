import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';
import { Grid, ListItemButton, ListItemText } from '@mui/material';
import { find, values } from 'lodash';
import Popover from '@mui/material/Popover';
import { DateRangePickerComponent } from './DateRangePickerComponent';
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

interface PopoverDateRangePickerProps {
  onSave: () => void;
  onHide: () => void;
  groupByTime: string;
  setTimeRange: (localTimeRange: moment.Moment[] | null[]) => void;
  timeRange: moment.Moment[] | null[];
  setGroupByTime: (groupByTime: string) => void;
}

export default function PopoverDateRangePicker(
  props: PopoverDateRangePickerProps,
) {
  const { timeRange, setTimeRange, groupByTime, setGroupByTime } = props;
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [localTimeRange, setLocalTimeRange] = useState<
    moment.Moment[] | null[]
  >(timeRange);
  const [localGroupByTime, setLocalGroupByTime] = useState<string>(groupByTime);

  const handleClickKatalonPopover = (event: React.MouseEvent<Element>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseKatalonPopover = () => {
    setAnchorEl(null);
  };

  const onSave = () => {
    props.onSave();
    setTimeRange(localTimeRange);
    setGroupByTime(localGroupByTime);
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

  const resonableTimeRange = timeRange[0] !== null && timeRange[1] !== null;

  const resonableLocalTimeRange =
    localTimeRange[0] !== null && localTimeRange[1] !== null;

  const overlayContent = (
    <ContentStyleWrapper>
      <Grid container className="popper-date-range-picker d-flex">
        <Grid item className="popper-date-range-picker__list-item">
          {values(TestRunDailyGroupByOptions).map(option => (
            <ListItemButton
              key={option.value}
              onClick={() => setLocalGroupByTime(option.value)}
              selected={option.value === localGroupByTime}
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
    ? `${groupByLabel} - ${timeRange[0]!.format(
        'YYYY-MM-DD',
      )} to ${timeRange[1]!.format('YYYY-MM-DD')}`
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
