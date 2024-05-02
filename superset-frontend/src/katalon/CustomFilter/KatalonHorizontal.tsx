/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import React, { useMemo } from 'react';
import {
  DataMaskStateWithId,
  FeatureFlag,
  isFeatureEnabled,
  JsonObject,
  styled,
  t,
} from '@superset-ui/core';
import Icons from 'src/components/Icons';
import Loading from 'src/components/Loading';
import { useSelector } from 'react-redux';
import {
  getFilterBarTestId,
  useChartsVerboseMaps,
} from 'src/dashboard/components/nativeFilters/FilterBar/utils';
import { HorizontalBarProps } from 'src/dashboard/components/nativeFilters/FilterBar/types';
import { DashboardLayout, RootState } from 'src/dashboard/types';
import { crossFiltersSelector } from 'src/dashboard/components/nativeFilters/FilterBar/CrossFilters/selectors';
import { getUrlParam } from 'src/utils/urlUtils';
import FilterConfigurationLink from 'src/dashboard/components/nativeFilters/FilterBar/FilterConfigurationLink';
import FilterBarSettings from 'src/dashboard/components/nativeFilters/FilterBar/FilterBarSettings';
import FilterControls from 'src/dashboard/components/nativeFilters/FilterBar/FilterControls/FilterControls';
import { KATALON_URL_PARAMS } from '../Constant';
import { getIsKatalonEmbeddedMode } from 'src/utils/getKatalonParams';

const HorizontalBar = styled.div`
  ${({ theme }) => `
    padding: ${theme.gridUnit * 3}px ${theme.gridUnit * 2}px ${
    theme.gridUnit * 3
  }px ${theme.gridUnit * 4}px;
    background: ${theme.colors.grayscale.light5};
  `}
`;

const HorizontalBarContent = styled.div`
  ${({ theme }) => `
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    line-height: 0;
    .loading {
      margin: ${theme.gridUnit * 2}px auto ${theme.gridUnit * 2}px;
      padding: 0;
    }
  `}
`;

const FilterBarEmptyStateContainer = styled.div`
  ${({ theme }) => `
    font-weight: ${theme.typography.weights.bold};
    color: ${theme.colors.grayscale.base};
    font-size: ${theme.typography.sizes.s}px;
  `}
`;

const FiltersLinkContainer = styled.div<{ hasFilters: boolean }>`
  ${({ theme, hasFilters }) => `
    height: 24px;
    display: flex;
    align-items: center;
    padding: 0 ${theme.gridUnit * 4}px 0 ${theme.gridUnit * 4}px;
    border-right: ${
      hasFilters ? `1px solid ${theme.colors.grayscale.light2}` : 0
    };
    button {
      display: flex;
      align-items: center;
      > .anticon {
        height: 24px;
        padding-right: ${theme.gridUnit}px;
      }
      > .anticon + span, > .anticon {
          margin-right: 0;
          margin-left: 0;
        }
    }
  `}
`;

// @ts-ignore
const HorizontalFilterBar: React.FC<HorizontalBarProps> = ({
  actions,
  canEdit,
  dashboardId,
  dataMaskSelected,
  filterValues,
  isInitialized,
  onSelectionChange,
}) => {
  const dataMask = useSelector<RootState, DataMaskStateWithId>(
    state => state.dataMask,
  );
  const chartConfiguration = useSelector<RootState, JsonObject>(
    state => state.dashboardInfo.metadata?.chart_configuration,
  );
  const dashboardLayout = useSelector<RootState, DashboardLayout>(
    state => state.dashboardLayout.present,
  );
  const isCrossFiltersEnabled = isFeatureEnabled(
    FeatureFlag.DASHBOARD_CROSS_FILTERS,
  );
  const verboseMaps = useChartsVerboseMaps();

  const selectedCrossFilters = isCrossFiltersEnabled
    ? crossFiltersSelector({
        dataMask,
        chartConfiguration,
        dashboardLayout,
        verboseMaps,
      })
    : [];
  const hasFilters = filterValues.length > 0 || selectedCrossFilters.length > 0;

  const actionsElement = useMemo(
    () =>
      isFeatureEnabled(FeatureFlag.DASHBOARD_NATIVE_FILTERS) ? actions : null,
    [actions],
  );

  const isKatalonEmbeddedMode = getIsKatalonEmbeddedMode();

  return (
    <HorizontalBar {...getFilterBarTestId()}>
      <HorizontalBarContent>
        {!isInitialized ? (
          <Loading position="inline-centered" />
        ) : (
          <>
            {!isKatalonEmbeddedMode && (
              <>
                <FilterBarSettings />
                {canEdit &&
                  isFeatureEnabled(FeatureFlag.DASHBOARD_NATIVE_FILTERS) && (
                    <FiltersLinkContainer hasFilters={hasFilters}>
                      <FilterConfigurationLink
                        dashboardId={dashboardId}
                        createNewOnOpen={filterValues.length === 0}
                      >
                        <Icons.PlusSmall /> {t('Add/Edit Filters')}
                      </FilterConfigurationLink>
                    </FiltersLinkContainer>
                  )}
              </>
            )}
            {!hasFilters && (
              <FilterBarEmptyStateContainer data-test="horizontal-filterbar-empty">
                {t('No filters are currently added to this dashboard.')}
              </FilterBarEmptyStateContainer>
            )}
            {hasFilters && (
              <FilterControls
                dataMaskSelected={dataMaskSelected}
                onFilterSelectionChange={onSelectionChange}
              />
            )}
            {actionsElement}
          </>
        )}
      </HorizontalBarContent>
    </HorizontalBar>
  );
};
export default React.memo(HorizontalFilterBar);
