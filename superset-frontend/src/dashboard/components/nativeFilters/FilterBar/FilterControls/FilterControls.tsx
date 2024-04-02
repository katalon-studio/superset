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
import React, {
  FC,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DataMask,
  DataMaskStateWithId,
  Filter,
  Divider,
  css,
  SupersetTheme,
  t,
  isFeatureEnabled,
  FeatureFlag,
  isNativeFilterWithDataMask,
  JsonObject,
} from '@superset-ui/core';
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from 'react-reverse-portal';
import { useSelector } from 'react-redux';
import {
  useDashboardHasTabs,
  useSelectFiltersInScope,
} from 'src/dashboard/components/nativeFilters/state';
import {
  DashboardLayout,
  FilterBarOrientation,
  RootState,
} from 'src/dashboard/types';
import DropdownContainer, {
  Ref as DropdownContainerRef,
} from 'src/components/DropdownContainer';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  ListSubheader,
  Menu,
  MenuItem,
  Checkbox,
} from '@material-ui/core';
import { FiltersOutOfScopeCollapsible } from '../FiltersOutOfScopeCollapsible';
import { useFilterControlFactory } from '../useFilterControlFactory';
import { FiltersDropdownContent } from '../FiltersDropdownContent';
import crossFiltersSelector from '../CrossFilters/selectors';
import CrossFilter from '../CrossFilters/CrossFilter';
import { useFilterOutlined } from '../useFilterOutlined';
import { useChartsVerboseMaps } from '../utils';

const useStyles = makeStyles({
  buttonAddMore: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    textTransform: 'none',
  },
});

type FilterControlsProps = {
  dataMaskSelected: DataMaskStateWithId;
  onFilterSelectionChange: (filter: Filter, dataMask: DataMask) => void;
};

const FilterControls: FC<FilterControlsProps> = ({
  dataMaskSelected,
  onFilterSelectionChange,
}) => {
  const classes = useStyles();
  const filterBarOrientation = useSelector<RootState, FilterBarOrientation>(
    ({ dashboardInfo }) =>
      isFeatureEnabled(FeatureFlag.HORIZONTAL_FILTER_BAR)
        ? dashboardInfo.filterBarOrientation
        : FilterBarOrientation.VERTICAL,
  );

  const { outlinedFilterId, lastUpdated } = useFilterOutlined();

  const [overflowedIds, setOverflowedIds] = useState<string[]>([]);
  const [addFilter, setAddFilter] = useState<Object[]>([]);
  const popoverRef = useRef<DropdownContainerRef>(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteFilter = (selectedFilter: { id: string }) => {
    setAddFilter((prevFilters: { id: string }[]) => {
      // Filter out the selectedFilter based on an 'id' property
      const filteredFilters = prevFilters.filter(
        filter => filter.id !== selectedFilter.id,
      );
      return filteredFilters;
    });
  };

  const handleCloseAdd = (selectedFilter: Object) => {
    const isFilterExisting = addFilter.find(
      filterComponent => filterComponent.id === selectedFilter.id,
    );

    if (!isFilterExisting) {
      setAddFilter((prevFilters: Object[]) => {
        const isFilterAdded = prevFilters.find(
          filter => filter === selectedFilter,
        );
        if (!isFilterAdded) {
          return [...prevFilters, selectedFilter];
        }
        return prevFilters;
      });
    } else {
      handleDeleteFilter(selectedFilter);
    }
    handleClose();
  };

  const dataMask = useSelector<RootState, DataMaskStateWithId>(
    state => state.dataMask,
  );
  const chartConfiguration = useSelector<RootState, JsonObject>(
    state => state.dashboardInfo.metadata?.chart_configuration,
  );
  const dashboardLayout = useSelector<RootState, DashboardLayout>(
    state => state.dashboardLayout.present,
  );
  const verboseMaps = useChartsVerboseMaps();

  const isCrossFiltersEnabled = isFeatureEnabled(
    FeatureFlag.DASHBOARD_CROSS_FILTERS,
  );
  const selectedCrossFilters = useMemo(
    () =>
      isCrossFiltersEnabled
        ? crossFiltersSelector({
            dataMask,
            chartConfiguration,
            dashboardLayout,
            verboseMaps,
          })
        : [],
    [chartConfiguration, dashboardLayout, dataMask, isCrossFiltersEnabled],
  );
  const { filterControlFactory, filtersWithValues } = useFilterControlFactory(
    dataMaskSelected,
    onFilterSelectionChange,
  );
  const portalNodes = useMemo(() => {
    const nodes = new Array(filtersWithValues.length);
    for (let i = 0; i < filtersWithValues.length; i += 1) {
      nodes[i] = createHtmlPortalNode();
    }
    return nodes;
  }, [filtersWithValues.length]);

  const filterIds = new Set(filtersWithValues.map(item => item.id));

  const [filtersInScope, filtersOutOfScope] =
    useSelectFiltersInScope(filtersWithValues);

  const hasRequiredFirst = useMemo(
    () => filtersWithValues.some(filter => filter.requiredFirst),
    [filtersWithValues],
  );

  const dashboardHasTabs = useDashboardHasTabs();
  const showCollapsePanel = dashboardHasTabs && filtersWithValues.length > 0;

  const renderer = useCallback(
    ({ id }: Filter | Divider, index: number | undefined) => {
      const filterIndex = filtersWithValues.findIndex(f => f.id === id);
      const key = index ?? id;
      return (
        // Empty text node is to ensure there's always an element preceding
        // the OutPortal, otherwise react-reverse-portal crashes
        <React.Fragment key={key}>
          {'' /* eslint-disable-line react/jsx-curly-brace-presence */}
          <OutPortal node={portalNodes[filterIndex]} inView />
        </React.Fragment>
      );
    },
    [filtersWithValues, portalNodes],
  );

  const renderVerticalContent = () => (
    <>
      {filtersInScope.map(renderer)}
      {showCollapsePanel && (
        <FiltersOutOfScopeCollapsible
          filtersOutOfScope={filtersOutOfScope}
          forceRender={hasRequiredFirst}
          hasTopMargin={filtersInScope.length > 0}
          renderer={renderer}
        />
      )}
    </>
  );

  const overflowedFiltersInScope = useMemo(
    () => filtersInScope.filter(({ id }) => overflowedIds?.includes(id)),
    [filtersInScope, overflowedIds],
  );

  const overflowedCrossFilters = useMemo(
    () =>
      selectedCrossFilters.filter(({ emitterId, name }) =>
        overflowedIds?.includes(`${name}${emitterId}`),
      ),
    [overflowedIds, selectedCrossFilters],
  );

  const activeOverflowedFiltersInScope = useMemo(() => {
    const activeOverflowedFilters = overflowedFiltersInScope.filter(filter =>
      isNativeFilterWithDataMask(filter),
    );
    return [...activeOverflowedFilters, ...overflowedCrossFilters];
  }, [overflowedCrossFilters, overflowedFiltersInScope]);

  const rendererCrossFilter = useCallback(
    (crossFilter, orientation, last) => (
      <CrossFilter
        filter={crossFilter}
        orientation={orientation}
        last={
          filtersInScope.length > 0 &&
          `${last.name}${last.emitterId}` ===
            `${crossFilter.name}${crossFilter.emitterId}`
        }
      />
    ),
    [filtersInScope.length],
  );

  const items = useMemo(() => {
    const crossFilters = selectedCrossFilters.map(c => ({
      // a combination of filter name and chart id to account
      // for multiple cross filters from the same chart in the future
      id: `${c.name}${c.emitterId}`,
      element: rendererCrossFilter(
        c,
        FilterBarOrientation.HORIZONTAL,
        selectedCrossFilters.at(-1),
      ),
    }));
    if (isFeatureEnabled(FeatureFlag.DASHBOARD_NATIVE_FILTERS)) {
      const nativeFiltersInScope = filtersInScope.map((filter, index) => ({
        id: filter.id,
        nameFilter: filter.name,
        element: (
          <div
            className="filter-item-wrapper"
            css={css`
              flex-shrink: 0;
            `}
          >
            {renderer(filter, index)}
          </div>
        ),
      }));
      return [...crossFilters, ...nativeFiltersInScope];
    }
    return [...crossFilters];
  }, [filtersInScope, renderer, rendererCrossFilter, selectedCrossFilters]);

  const renderPopperMenu = (invisbleFilter: Object[]) => {
    console.log('hello world');

    return (
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <ListSubheader
          sx={{
            color: '#808b9a',
            fontSize: 12,
            fontWeight: 'bold',
            marginTop: 0.8,
            marginBottom: 1,
          }}
        >
          {t('all filters').toUpperCase()}
        </ListSubheader>

        {invisbleFilter.length !== 0 &&
          invisbleFilter.map(item => {
            const isFilterExisting = addFilter.find(
              filterComponent => filterComponent?.id === item?.id,
            );
            return (
              <MenuItem onClick={() => handleCloseAdd(item)} key={item?.id}>
                {item?.nameFilter}
                <Checkbox color="primary" checked={!!isFilterExisting} />
              </MenuItem>
            );
          })}
      </Menu>
    );
  };

  const rednerDynamicButton = () => {
    console.log(items);
    const visibleFilter = items.slice(0, 2);
    const invisbleFilter = items.slice(3);

    return (
      <div>
        {visibleFilter.length !== 0 &&
          visibleFilter.map((item, index) => (
            <div key={index}>{item.element}</div>
          ))}
        {addFilter.length !== 0 &&
          addFilter.map((item, index) => <div key={index}>{item.element}</div>)}
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          className={classes.buttonAddMore}
        >
          + Add more
        </Button>
        {renderPopperMenu(invisbleFilter)}
      </div>
    );
  };

  console.log(activeOverflowedFiltersInScope);
  console.log(overflowedFiltersInScope);
  console.log(filtersOutOfScope);

  const renderHorizontalContent = () => (
    <div
      css={(theme: SupersetTheme) => css`
        padding: 0 ${theme.gridUnit * 4}px;
        min-width: 0;
        flex: 1;
      `}
    >
      <DropdownContainer
        items={items}
        dropdownTriggerIcon={
          <Icons.FilterSmall
            css={css`
              && {
                margin-right: -4px;
                display: flex;
              }
            `}
          />
        }
        dropdownTriggerText={t('More filters')}
        dropdownTriggerCount={activeOverflowedFiltersInScope.length}
        dropdownTriggerTooltip={
          activeOverflowedFiltersInScope.length === 0
            ? t('No applied filters')
            : t(
                'Applied filters: %s',
                activeOverflowedFiltersInScope
                  .map(filter => filter.name)
                  .join(', '),
              )
        }
        dropdownContent={
          overflowedFiltersInScope.length ||
          overflowedCrossFilters.length ||
          (filtersOutOfScope.length && showCollapsePanel)
            ? () => (
                <FiltersDropdownContent
                  overflowedCrossFilters={overflowedCrossFilters}
                  filtersInScope={overflowedFiltersInScope}
                  filtersOutOfScope={filtersOutOfScope}
                  renderer={renderer}
                  rendererCrossFilter={rendererCrossFilter}
                  showCollapsePanel={showCollapsePanel}
                  forceRenderOutOfScope={hasRequiredFirst}
                />
              )
            : undefined
        }
        forceRender={hasRequiredFirst}
        ref={popoverRef}
        onOverflowingStateChange={({ overflowed: nextOverflowedIds }) => {
          if (
            nextOverflowedIds.length !== overflowedIds.length ||
            overflowedIds.reduce(
              (a, b, i) => a || b !== nextOverflowedIds[i],
              false,
            )
          ) {
            setOverflowedIds(nextOverflowedIds);
          }
        }}
      />
    </div>
  );

  const overflowedByIndex = useMemo(() => {
    const filtersOutOfScopeIds = new Set(filtersOutOfScope.map(({ id }) => id));
    const overflowedFiltersInScopeIds = new Set(
      overflowedFiltersInScope.map(({ id }) => id),
    );

    return filtersWithValues.map(
      filter =>
        filtersOutOfScopeIds.has(filter.id) ||
        overflowedFiltersInScopeIds.has(filter.id),
    );
  }, [filtersOutOfScope, filtersWithValues, overflowedFiltersInScope]);

  useEffect(() => {
    if (outlinedFilterId && overflowedIds.includes(outlinedFilterId)) {
      popoverRef?.current?.open();
    }
  }, [outlinedFilterId, lastUpdated, popoverRef, overflowedIds]);

  return (
    <>
      {portalNodes
        .filter((node, index) => filterIds.has(filtersWithValues[index].id))
        .map((node, index) => (
          <InPortal node={node} key={filtersWithValues[index].id}>
            {filterControlFactory(
              index,
              filterBarOrientation,
              overflowedByIndex[index],
            )}
          </InPortal>
        ))}
      {filterBarOrientation === FilterBarOrientation.VERTICAL &&
        renderVerticalContent()}
      {filterBarOrientation === FilterBarOrientation.HORIZONTAL &&
        rednerDynamicButton()}
      {/* {filterBarOrientation === FilterBarOrientation.HORIZONTAL &&
        renderHorizontalContent()} */}
    </>
  );
};

export default React.memo(FilterControls);
