/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  useInitialization,
  useNativeFiltersDataMask,
} from '../dashboard/components/nativeFilters/FilterBar/state';
import { hydrateDashboard } from '../dashboard/actions/hydrate';
import { useDashboard, useDashboardCharts } from '../hooks/apiResources';

function KatalonSyncDashboardState({ children }: any) {
  const dashboardState = useSelector<any, any>(
    ({ dashboardState }) => dashboardState,
  );
  const isDashboardPage = Object.keys(dashboardState).length > 0;

  const dispatch = useDispatch();
  const history = useHistory();
  const dashboardId = useSelector<any, number>(
    ({ dashboardInfo }) => dashboardInfo?.id,
  );
  const isInitialized = useInitialization();
  const { result: dashboard } = useDashboard(dashboardId);
  const { result: charts } = useDashboardCharts(dashboardId);
  const currentFilters = useNativeFiltersDataMask();
  const [previousFilters, setPreviousFilters] = useState(currentFilters);
  const [filtersFromParent, setFiltersFromParent] = useState(null);

  const readyToHydrate = Boolean(dashboard && charts);

  // Send filters to parent
  useEffect(() => {
    if (isDashboardPage) {
      const isApplyFiltersClicked =
        isInitialized && !shallowEqual(previousFilters, currentFilters);
      if (isApplyFiltersClicked) {
        window.parent.postMessage(JSON.stringify(currentFilters), '*');
      }
      setPreviousFilters(currentFilters);
    }
  }, [currentFilters]);

  // Receive filters from parent
  useEffect(() => {
    if (isDashboardPage) {
      window.addEventListener('message', event => {
        if (event.data.raFilter) {
          const receivedFilters = JSON.parse(event.data.raFilter);
          setFiltersFromParent(receivedFilters);
        }
      });
    }
  }, []);

  // Send ready message to parent, so it can start sending filters
  useEffect(() => {
    if (isDashboardPage && isInitialized) {
      window.parent.postMessage('iframe ready', '*');
    }
  }, [isInitialized]);

  // Hydrate dashboard with received filters
  useEffect(() => {
    if (isDashboardPage && readyToHydrate && filtersFromParent) {
      dispatch(
        hydrateDashboard({
          history,
          dashboard,
          charts,
          activeTabs: undefined,
          dataMask: filtersFromParent,
        }),
      );
    }
  }, [readyToHydrate, filtersFromParent]);

  return <>{children}</>;
}

export default KatalonSyncDashboardState;
