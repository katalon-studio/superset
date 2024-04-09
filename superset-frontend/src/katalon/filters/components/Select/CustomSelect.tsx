/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { FormControl, MenuItem, Popover } from '@mui/material';
import React from 'react';
import { SelectProps } from 'src/components/Select/types';
import { DropdownLabel } from '../Time/DropdownLabel';

interface CustomSelectProps {
  selectLabel: string;
  id: string | undefined;
  fullSelectOptions: any;
  enableDropDown: HTMLButtonElement | null;
  handleCloseClickDropdown: () => void;
  handleClickDropdown: (event: React.MouseEvent<HTMLElement>) => void;
  handleMenuItemClick: (
    event: React.MouseEvent<HTMLElement>,
    option: SelectProps['onSelect'],
  ) => void;
}

function CustomSelect(props: CustomSelectProps) {
  const {
    selectLabel,
    id,
    fullSelectOptions,
    enableDropDown,
    handleCloseClickDropdown,
    handleClickDropdown,
    handleMenuItemClick,
  } = props;

  const open = Boolean(enableDropDown);

  return (
    <FormControl sx={{ width: 150 }}>
      <DropdownLabel
        onClick={handleClickDropdown}
        label={selectLabel}
        isActive={enableDropDown !== null}
        isPlaceholder={false}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={enableDropDown}
        onClose={handleCloseClickDropdown}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{
          maxHeight: fullSelectOptions.length > 10 ? '500px' : undefined,
          overflow: 'auto',
          '& .MuiMenuItem-root': {
            width: '150px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          },
        }}
      >
        {fullSelectOptions &&
          fullSelectOptions.map(option => (
            <MenuItem
              key={option.label}
              value={option.label}
              onClick={event => handleMenuItemClick(event, option)}
            >
              {option.label}
            </MenuItem>
          ))}
      </Popover>
    </FormControl>
  );
}

export default CustomSelect;
