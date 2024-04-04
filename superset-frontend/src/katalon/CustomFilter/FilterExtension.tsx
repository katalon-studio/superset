import React, { useState, MouseEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { t } from '@superset-ui/core';
import {
  Button,
  Checkbox,
  Grid,
  ListSubheader,
  Menu,
  MenuItem,
} from '@material-ui/core';

interface FilterItem {
  id: string;
  name: string;
  element: JSX.Element;
}

interface FilterExtensionProps {
  items: FilterItem[];
}

const useStyles = makeStyles({
  buttonAddMore: {
    background: '#FFFFFF',
    textTransform: 'none',
    fontSize: 16,
    fontWeight: 600,
  },
  filterTitle: {
    color: '#797B7F',
    fontSize: 14,
    fontWeight: 700,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '3px',
  },
});

function FilterExtension(props: FilterExtensionProps) {
  const classes = useStyles();

  const { items } = props;

  const [addFilter, setAddFilter] = useState<FilterExtensionProps | []>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteFilter = (selectedFilter: { id: string }) => {
    setAddFilter(
      (prevFilters: { id: string; name: string; element: JSX.Element }[]) => {
        // Filter out the selectedFilter based on the 'id' property
        const filteredFilters = prevFilters.filter(
          filter => filter.id !== selectedFilter.id,
        );
        return filteredFilters;
      },
    );
  };

  const handleCloseAdd = (selectedFilter: FilterItem) => {
    const isFilterExisting = addFilter.find(
      filterComponent => filterComponent.id === selectedFilter.id,
    );

    if (!isFilterExisting) {
      setAddFilter((prevFilters: FilterExtensionProps) => {
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

  const renderPopperMenu = (
    invisbleFilter: Array<{ id: string; name: string; element: JSX.Element }>,
  ) => (
    <Menu
      elevation={2}
      getContentAnchorEl={null}
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
      <ListSubheader className={classes.filterTitle}>
        {t('all filters').toUpperCase()}
      </ListSubheader>
      {invisbleFilter.length !== 0 &&
        invisbleFilter.map(item => {
          const isFilterExisting = addFilter.find(
            filterComponent => filterComponent?.id === item?.id,
          );
          return (
            <MenuItem onClick={() => handleCloseAdd(item)} key={item?.id}>
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
    const visibleFilter = items.slice(0, 2);
    const invisbleFilter = items.slice(3);

    return (
      <div className={classes.flexContainer}>
        {visibleFilter.length !== 0 &&
          visibleFilter.map((item, index) => (
            <div key={index}>{item.element}</div>
          ))}
        {addFilter.length !== 0 &&
          addFilter.map((item, index) => <div key={index}>{item.element}</div>)}
        <Button
          aria-controls="add-more"
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

  return <>{renderAddMoreButton()}</>;
}

export default FilterExtension;
