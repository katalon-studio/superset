/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { styled, NO_TIME_RANGE } from '@superset-ui/core';
import React, { useCallback, useEffect } from 'react';
import { FilterPluginStyle } from 'src/filters/components/common';
import { PluginFilterTimeProps } from 'src/filters/components/types';
import DateFilterLabel from './DateFilterLabel';

const TimeFilterStyles = styled(FilterPluginStyle)`
  display: flex;
  align-items: center;
  overflow-x: auto;

  & .ant-tag {
    margin-right: 0;
  }
`;

const ControlContainer = styled.div<{
  validateStatus?: 'error' | 'warning' | 'info';
}>`
  display: flex;
  height: 100%;
  max-width: 100%;
  width: 100%;
  & > div,
  & > div:hover {
    ${({ validateStatus, theme }) =>
      validateStatus && `border-color: ${theme.colors[validateStatus]?.base}`}
  }
`;

export default function TimeFilterPlugin(props: PluginFilterTimeProps) {
  const {
    setDataMask,
    setHoveredFilter,
    unsetHoveredFilter,
    setFocusedFilter,
    unsetFocusedFilter,
    setFilterActive,
    width,
    height,
    filterState,
    inputRef,
    isOverflowingFilterBar = false,
  } = props;

  const handleTimeRangeChange = useCallback(
    (timeRange?: string, timeGrain?: string): void => {
      const isSet = timeRange && timeRange !== NO_TIME_RANGE;
      const extraFormData: any = isSet
        ? {
            time_range: timeRange,
          }
        : {};

      const filterState: any = {
        value: isSet ? timeRange : undefined,
      };
      if (timeGrain) {
        extraFormData.time_grain_sqla = timeGrain;
        filterState.time_grain_sqla = timeGrain;
      }

      setDataMask({
        extraFormData,
        filterState,
      });
    },
    [setDataMask],
  );

  console.log(filterState);

  return props.formData?.inView ? (
    <TimeFilterStyles width={width} height={height}>
      <ControlContainer
        ref={inputRef}
        validateStatus={filterState.validateStatus}
        onFocus={setFocusedFilter}
        onBlur={unsetFocusedFilter}
        onMouseEnter={setHoveredFilter}
        onMouseLeave={unsetHoveredFilter}
      >
        <DateFilterLabel
          groupByTime={filterState.time_grain_sqla || 'P1D'}
          value={filterState.value || NO_TIME_RANGE}
          name="time_range"
          onChange={handleTimeRangeChange}
          onOpenPopover={() => setFilterActive(true)}
          onClosePopover={() => {
            setFilterActive(false);
            unsetHoveredFilter();
            unsetFocusedFilter();
          }}
          isOverflowingFilterBar={isOverflowingFilterBar}
        />
      </ControlContainer>
    </TimeFilterStyles>
  ) : null;
}
