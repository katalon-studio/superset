/* eslint-disable theme-colors/no-literal-colors */
import React, { useState, MouseEvent } from 'react';
import { t } from '@superset-ui/core';
import {
  Button,
  Checkbox,
  Grid,
  ListSubheader,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import styled from 'styled-components';

interface FilterItem {
  id: string;
  name: string;
  element: JSX.Element;
}

interface FilterExtensionProps {
  items: FilterItem[];
}

// eslint-disable-next-line theme-colors/no-literal-colors
const ContentStyleWrapper = styled.div`
  display: flex;
  align-items: end;
  .ant-form-item-control {
    width: 190px !important;
    margin-right: 10px;
  }
  .MuiFormControl-root {
    max-width: 100% !important;
  }
  .ant-form-item-label {
    label {
      height: 100% !important;
      h4 {
        color: #47494d;
        font-weight: 500;
      }
    }
  }
`;

function FilterExtension(props: FilterExtensionProps) {
  const { items } = props;

  const [addFilter, setAddFilter] = useState<FilterItem[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddOrRemove = (selectedFilter: FilterItem) => {
    setAddFilter((prevFilters: FilterItem[]) => {
      // Check if the filter is already added
      const isFilterExisting = prevFilters.some(
        filter => filter.id === selectedFilter.id,
      );

      if (isFilterExisting) {
        // If the filter exists, remove it from the list
        return prevFilters.filter(filter => filter.id !== selectedFilter.id);
      }
      return [...prevFilters, selectedFilter];
    });
    handleClose();
  };

  const renderPopperMenu = (invisbleFilter: FilterItem[]) => (
    <Menu
      elevation={2}
      id="list-advance-filter"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <ListSubheader
        sx={{
          color: '#797B7F',
          fontSize: 14,
          fontWeight: 700,
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
            <MenuItem onClick={() => handleAddOrRemove(item)} key={item?.id}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                <Grid item xs={8}>
                  {item?.name}
                </Grid>
                <Grid item xs={4}>
                  <Checkbox color="primary" checked={!!isFilterExisting} />
                </Grid>
              </Grid>
            </MenuItem>
          );
        })}
    </Menu>
  );

  const renderAddMoreButton = () => {
    // Take the list all filters,
    // then device them into two parts
    const visibleFilter: FilterItem[] = items.slice(0, 4);
    const invisbleFilter: FilterItem[] = items.slice(4);

    return (
      <ContentStyleWrapper>
        <Stack
          sx={{
            display: 'flex',
            alignItems: 'end',
            flexWrap: 'wrap',
          }}
          direction="row"
        >
          {visibleFilter.length !== 0 &&
            visibleFilter.map((item, index) => (
              <div id={item.name} key={index}>
                {item.element}
              </div>
            ))}
          {addFilter.length !== 0 &&
            addFilter.map((item, index) => (
              <div id={item.name} key={index}>
                {item.element}
              </div>
            ))}
          {invisbleFilter.length !== 0 && (
            <Button
              sx={{
                height: '40px',
                bgcolor: '#FFFFFF',
                color: '#0F1866',
                textTransform: 'none',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: '1.14',
                whiteSpace: 'nowrap',
              }}
              onClick={handleClick}
            >
              {t('+ Add more')}
            </Button>
          )}
          {renderPopperMenu(invisbleFilter)}
        </Stack>
      </ContentStyleWrapper>
    );
  };

  return <>{renderAddMoreButton()}</>;
}

export default FilterExtension;
