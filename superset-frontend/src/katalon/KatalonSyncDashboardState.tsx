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
  const [filtersFromParent, setFiltersFromParent] = useState();

  // Send filters to parent
  useEffect(() => {
    const isApplyFiltersClicked =
      isInitialized && !shallowEqual(previousFilters, currentFilters);
    if (isApplyFiltersClicked) {
      window.parent.postMessage(JSON.stringify(currentFilters), '*');
    }
    setPreviousFilters(currentFilters);
  }, [currentFilters]);

  // Receive filters from parent
  useEffect(() => {
    window.addEventListener('message', event => {
      if (event.data.raFilter) {
        const receivedFilters = JSON.parse(event.data.raFilter);
        setFiltersFromParent(receivedFilters);
      }
    });
  }, []);

  // Send ready message to parent, so it can start sending filters
  useEffect(() => {
    if (isInitialized) {
      window.parent.postMessage('iframe ready', '*');
    }
  }, [isInitialized]);

  // Hydrate dashboard with received filters
  useEffect(() => {
    if (isInitialized && filtersFromParent && dashboard && charts) {
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
  }, [filtersFromParent]);

  return <>{children}</>;
}

export default KatalonSyncDashboardState;
