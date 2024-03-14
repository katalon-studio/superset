import React, { useEffect, useState } from 'react';
import { useDispatch, shallowEqual } from 'react-redux';
import { DataMaskStateWithId } from '@superset-ui/core';
import { updateDataMask } from '../dataMask/actions';
import {
  useInitialization,
  useNativeFiltersDataMask,
} from '../dashboard/components/nativeFilters/FilterBar/state';

function KatalonSyncDashboardState({ children }: any) {
  const dispatch = useDispatch();

  const currentFilters: DataMaskStateWithId = useNativeFiltersDataMask();
  const [previousFilters, setPreviousFilters] =
    useState<DataMaskStateWithId>(currentFilters);
  const isInitialized = useInitialization();

  const isApplyFiltersClicked =
    isInitialized && !shallowEqual(previousFilters, currentFilters);

  useEffect(() => {
    if (isApplyFiltersClicked) {
      window.parent.postMessage(JSON.stringify(currentFilters), '*');
    }
    setPreviousFilters(currentFilters);
  }, [currentFilters]);

  useEffect(() => {
    if (isInitialized) {
      window.parent.postMessage('iframe ready', '*');
    }
  }, [isInitialized]);

  useEffect(() => {
    window.addEventListener('message', event => {
      if (event.data.raFilter) {
        const receivedFilterState = JSON.parse(event.data.raFilter);
        const filterIds = Object.keys(receivedFilterState);
        filterIds.forEach(filterId => {
          dispatch(updateDataMask(filterId, receivedFilterState[filterId]));
        });
      }
    });
  }, []);

  return <div>{children}</div>;
}

export default KatalonSyncDashboardState;
