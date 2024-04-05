/* eslint-disable theme-colors/no-literal-colors */
import React, { ReactNode, useState, useEffect, useMemo } from 'react';
import {
  css,
  styled,
  t,
  useTheme,
  NO_TIME_RANGE,
  SupersetTheme,
  useCSSTextTruncation,
} from '@superset-ui/core';
import Button from '@mui/material/Button';
import ControlHeader from 'src/explore/components/ControlHeader';
import Modal from 'src/components/Modal';
import Icons from 'src/components/Icons';
import { Tooltip } from 'src/components/Tooltip';
import { useDebouncedEffect } from 'src/explore/exploreUtils';
import { SLOW_DEBOUNCE } from 'src/constants';
import { noOp } from 'src/utils/common';
import ControlPopover from 'src/explore/components/controls/ControlPopover/ControlPopover';
import {
  FrameType,
} from 'src/explore/components/controls/DateFilterControl/types';
import {
  DATE_FILTER_TEST_KEY,
  fetchTimeRange,
  guessFrame,
  useDefaultTimeFilter,
} from 'src/explore/components/controls/DateFilterControl';
import { DateLabel } from 'src/explore/components/controls/DateFilterControl/components';
import moment from 'moment';
import { Grid, ListItemButton, ListItemText } from '@mui/material';
import { find, values } from 'lodash';
import DateRangePickerComponent from './DateRangePickerComponent';
import { DropdownLabel } from './DropdownLabel';

const ContentStyleWrapper = styled.div`
  ${({ theme }) => css`
    margin: -12px -16px;

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

    .ant-row {
      margin-top: 8px;
    }

    .ant-input-number {
      width: 100%;
    }

    .ant-picker {
      padding: 4px 17px 4px;
      border-radius: 4px;
      width: 100%;
    }

    .ant-divider-horizontal {
      margin: 16px 0;
    }

    .control-label {
      font-size: 11px;
      font-weight: ${theme.typography.weights.medium};
      color: ${theme.colors.grayscale.light2};
      line-height: 16px;
      text-transform: uppercase;
      margin: 8px 0;
    }

    .vertical-radio {
      display: block;
      height: 40px;
      line-height: 40px;
    }

    .section-title {
      font-style: normal;
      font-weight: ${theme.typography.weights.bold};
      font-size: 15px;
      line-height: 24px;
      margin-bottom: 8px;
    }

    .control-anchor-to {
      margin-top: 16px;
    }

    .control-anchor-to-datetime {
      width: 217px;
    }

    .footer {
      text-align: right;
      padding: 0.5rem;
    }
  `}
`;

const IconWrapper = styled.span`
  span {
    margin-right: ${({ theme }) => 2 * theme.gridUnit}px;
    vertical-align: middle;
  }
  .text {
    vertical-align: middle;
  }
  .error {
    color: ${({ theme }) => theme.colors.error.base};
  }
`;

const getTooltipTitle = (
  isLabelTruncated: boolean,
  label: string | undefined,
  range: string | undefined,
) =>
  isLabelTruncated ? (
    <div>
      {label && <strong>{label}</strong>}
      {range && (
        <div
          css={(theme: SupersetTheme) => css`
            margin-top: ${theme.gridUnit}px;
          `}
        >
          {range}
        </div>
      )}
    </div>
  ) : (
    range || null
  );

export default function DateFilterLabel(props: any) {
  const {
    onChange,
    onOpenPopover = noOp,
    onClosePopover = noOp,
    overlayStyle = 'Popover',
    isOverflowingFilterBar = false,
  } = props;
  const defaultTimeFilter = useDefaultTimeFilter();

  const value = props.value ?? defaultTimeFilter;
  const timeRangeValueList =
    value === 'No filter'
      ? [null, null]
      : value
          .split(' : ')
          .map((timeString: string) =>
            moment(timeString, 'YYYY-MM-DDTHH:mm:ss'),
          );
  const [localTimeRange, setLocalTimeRange] = React.useState(timeRangeValueList);

  const [actualTimeRange, setActualTimeRange] = useState<string>(value);

  const [show, setShow] = useState<boolean>(false);
  const guessedFrame = useMemo(() => guessFrame(value), [value]);
  const [frame, setFrame] = useState<FrameType>(guessedFrame);
  const [lastFetchedTimeRange, setLastFetchedTimeRange] = useState(value);
  const [timeRangeValue, setTimeRangeValue] = useState(value);
  const [validTimeRange, setValidTimeRange] = useState<boolean>(false);
  const [evalResponse, setEvalResponse] = useState<string>(value);
  const [tooltipTitle, setTooltipTitle] = useState<ReactNode | null>(value);
  const theme = useTheme();
  const [labelRef, labelIsTruncated] = useCSSTextTruncation<HTMLSpanElement>();
  const [groupByTime, setGroupByTime] = useState(props.groupByTime);

  useEffect(() => {
    if (value === NO_TIME_RANGE) {
      setActualTimeRange(NO_TIME_RANGE);
      setTooltipTitle(null);
      setValidTimeRange(true);
      return;
    }
    fetchTimeRange(value).then(({ value: actualRange, error }) => {
      if (error) {
        setEvalResponse(error || '');
        setValidTimeRange(false);
        setTooltipTitle(value || null);
      } else {
        /*
          HRT == human readable text
          ADR == actual datetime range
          +--------------+------+----------+--------+----------+-----------+
          |              | Last | Previous | Custom | Advanced | No Filter |
          +--------------+------+----------+--------+----------+-----------+
          | control pill | HRT  | HRT      | ADR    | ADR      |   HRT     |
          +--------------+------+----------+--------+----------+-----------+
          | tooltip      | ADR  | ADR      | HRT    | HRT      |   ADR     |
          +--------------+------+----------+--------+----------+-----------+
        */
        if (
          guessedFrame === 'Common' ||
          guessedFrame === 'Calendar' ||
          guessedFrame === 'No filter'
        ) {
          setActualTimeRange(value);
          setTooltipTitle(
            getTooltipTitle(labelIsTruncated, value, actualRange),
          );
        } else {
          setActualTimeRange(actualRange || '');
          setTooltipTitle(
            getTooltipTitle(labelIsTruncated, actualRange, value),
          );
        }
        setValidTimeRange(true);
      }
      setLastFetchedTimeRange(value);
      setEvalResponse(actualRange || value);
    });
  }, [guessedFrame, labelIsTruncated, labelRef, value]);

  useDebouncedEffect(
    () => {
      if (timeRangeValue === NO_TIME_RANGE) {
        setEvalResponse(NO_TIME_RANGE);
        setLastFetchedTimeRange(NO_TIME_RANGE);
        setValidTimeRange(true);
        return;
      }
      if (lastFetchedTimeRange !== timeRangeValue) {
        fetchTimeRange(timeRangeValue).then(({ value: actualRange, error }) => {
          if (error) {
            setEvalResponse(error || '');
            setValidTimeRange(false);
          } else {
            setEvalResponse(actualRange || '');
            setValidTimeRange(true);
          }
          setLastFetchedTimeRange(timeRangeValue);
        });
      }
    },
    SLOW_DEBOUNCE,
    [timeRangeValue],
  );

  function onSave() {
    const newTimeRange = `${localTimeRange[0].format(
      'YYYY-MM-DDTHH:mm:ss',
    )} : ${localTimeRange[1].format('YYYY-MM-DDTHH:mm:ss')}`;
    onChange(newTimeRange, groupByTime);
    setShow(false);
    onClosePopover();
  }

  function onOpen() {
    setTimeRangeValue(value);
    setFrame(guessedFrame);
    setShow(true);
    onOpenPopover();
  }

  function onHide() {
    setTimeRangeValue(value);
    setFrame(guessedFrame);
    setShow(false);
    onClosePopover();
  }

  const toggleOverlay = () => {
    if (show) {
      onHide();
    } else {
      onOpen();
    }
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
        <Button
          color="primary"
          key="cancel"
          onClick={onHide}
          data-test={DATE_FILTER_TEST_KEY.cancelButton}
        >
          {t('CANCEL')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!validTimeRange}
          key="apply"
          onClick={onSave}
          data-test={DATE_FILTER_TEST_KEY.applyButton}
        >
          {t('APPLY')}
        </Button>
      </div>
    </ContentStyleWrapper>
  );

  const title = (
    <IconWrapper>
      <Icons.EditAlt iconColor={theme.colors.grayscale.base} />
      <span className="text">{t('Date range picker')}</span>
    </IconWrapper>
  );

  const dateFormat = 'YYYY/MM/DD';


  const groupByLabel = find(values(TestRunDailyGroupByOptions), {
    value: groupByTime,
  })?.label;

  const label = `${groupByLabel} - ${timeRangeValueList[0].format(
    'YYYY-MM-DD',
  )} to ${timeRangeValueList[1].format('YYYY-MM-DD')}`;

  const popoverContent = (
    <ControlPopover
      placement="right"
      trigger="click"
      content={overlayContent}
      defaultVisible={show}
      visible={show}
      onVisibleChange={toggleOverlay}
      getPopupContainer={triggerNode =>
        isOverflowingFilterBar
          ? (triggerNode.parentNode as HTMLElement)
          : document.body
      }
      destroyTooltipOnHide
    >
      <Tooltip
        placement="top"
        title={label}
        getPopupContainer={trigger => trigger.parentElement as HTMLElement}
      >
        <DropdownLabel
          label={label}
          isActive={show}
          isPlaceholder={actualTimeRange === NO_TIME_RANGE}
          data-test={DATE_FILTER_TEST_KEY.popoverOverlay}
          ref={labelRef}
        />
      </Tooltip>
    </ControlPopover>
  );

  const modalContent = (
    <>
      <Tooltip
        placement="top"
        title={tooltipTitle}
        getPopupContainer={trigger => trigger.parentElement as HTMLElement}
      >
        <DateLabel
          onClick={toggleOverlay}
          label={actualTimeRange}
          isActive={show}
          isPlaceholder={actualTimeRange === NO_TIME_RANGE}
          data-test={DATE_FILTER_TEST_KEY.modalOverlay}
          ref={labelRef}
        />
      </Tooltip>
      {/* the zIndex value is from trying so that the Modal doesn't overlay the AdhocFilter when GENERIC_CHART_AXES is enabled */}
      <Modal
        title={title}
        show={show}
        onHide={toggleOverlay}
        width="600px"
        hideFooter
        zIndex={1030}
      >
        {overlayContent}
      </Modal>
    </>
  );

  return (
    <>
      <ControlHeader {...props} />
      {overlayStyle === 'Modal' ? modalContent : popoverContent}
    </>
  );
}
