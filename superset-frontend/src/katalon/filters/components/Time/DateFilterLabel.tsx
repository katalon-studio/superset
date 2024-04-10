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
import ControlHeader from 'src/explore/components/ControlHeader';
import { useDebouncedEffect } from 'src/explore/exploreUtils';
import { SLOW_DEBOUNCE } from 'src/constants';
import { noOp } from 'src/utils/common';
import { FrameType } from 'src/explore/components/controls/DateFilterControl/types';
import {
  DATE_FILTER_TEST_KEY,
  fetchTimeRange,
  guessFrame,
  useDefaultTimeFilter,
} from 'src/explore/components/controls/DateFilterControl';
import moment from 'moment';
import PopoverDateRangePicker from './PopoverDateRangePicker';

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
    onClosePopover = noOp,
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
  const [timeRange, setTimeRange] =
    React.useState(timeRangeValueList);

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

  function onSave(timeRange: moment.Moment[] | null[], groupByTime: string) {
    const newTimeRange = `${timeRange[0]!.format(
      'YYYY-MM-DDTHH:mm:ss',
    )} : ${timeRange[1]!.format('YYYY-MM-DDTHH:mm:ss')}`;
    onChange(newTimeRange, groupByTime);
    setShow(false);
    onClosePopover();
  }

  function onHide() {
    setTimeRangeValue(value);
    setFrame(guessedFrame);
    setShow(false);
    onClosePopover();
  }

  const popoverContent = (
    <PopoverDateRangePicker
      onSave={onSave}
      onHide={onHide}
      groupByTime={groupByTime}
      setGroupByTime={setGroupByTime}
      setTimeRange={setTimeRange}
      timeRange={timeRange}
    />
  );

  return (
    <>
      <ControlHeader {...props} />
       {popoverContent}
    </>
  );
}
