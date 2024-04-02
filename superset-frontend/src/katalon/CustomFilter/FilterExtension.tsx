import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { t } from '@superset-ui/core';
import {
  Button,
  Checkbox,
  ListSubheader,
  Menu,
  MenuItem,
} from '@material-ui/core';

interface FilterProps {
  items: Array<{ id: string; name: string; element: JSX.Element }>;
}

const useStyles = makeStyles({
  buttonAddMore: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    textTransform: 'none',
  },
  listSubheader: {
    color: '#FF0000',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: '12px',
    marginBottom: '6px',
  },
});

function FilterExtension(props: FilterProps) {
  const classes = useStyles();

  const { items } = props;

  const [addFilter, setAddFilter] = useState<
    Array<{ id: string; name: string; element: JSX.Element }>
  >([]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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

  const handleCloseAdd = (selectedFilter: {
    id: string;
    name: string;
    element: JSX.Element;
  }) => {
    const isFilterExisting = addFilter.find(
      filterComponent => filterComponent.id === selectedFilter.id,
    );

    if (!isFilterExisting) {
      setAddFilter(
        (
          prevFilters: Array<{
            id: string;
            name: string;
            element: JSX.Element;
          }>,
        ) => {
          const isFilterAdded = prevFilters.find(
            filter => filter === selectedFilter,
          );
          if (!isFilterAdded) {
            return [...prevFilters, selectedFilter];
          }
          return prevFilters;
        },
      );
    } else {
      handleDeleteFilter(selectedFilter);
    }
    handleClose();
  };

  const renderPopperMenu = (
    invisbleFilter: Array<{ id: string; name: string; element: JSX.Element }>,
  ) => {
    console.log('hello world');

    return (
      <Menu
        id="list-advance-filter"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <ListSubheader className={classes.listSubheader}>
          {t('all filters').toUpperCase()}
        </ListSubheader>

        {invisbleFilter.length !== 0 &&
          invisbleFilter.map(item => {
            const isFilterExisting = addFilter.find(
              filterComponent => filterComponent?.id === item?.id,
            );
            return (
              <MenuItem onClick={() => handleCloseAdd(item)} key={item?.id}>
                {item?.name}
                <Checkbox color="primary" checked={!!isFilterExisting} />
              </MenuItem>
            );
          })}
      </Menu>
    );
  };

  const renderDynamicButton = () => {
    // Take the list all filters,
    // then device them into two parts
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

  return <div>{renderDynamicButton()}</div>;
}

export default FilterExtension;
