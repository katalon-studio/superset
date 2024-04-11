/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { Box, FormControl, MenuItem, Popover, Typography } from '@mui/material';
import React from 'react';
import IconCheck from '@mui/icons-material/Check';
import { DropdownLabel } from '../Time/DropdownLabel';

interface CustomSelectProps {
  selectLabel: any;
  id: string | undefined;
  fullSelectOptions: any;
  enableDropDown: HTMLButtonElement | null;
  handleCloseClickDropdown: () => void;
  handleClickDropdown: (event: React.MouseEvent<HTMLElement>) => void;
  handleMenuItemClick: (
    event: React.MouseEvent<HTMLElement>,
    option: any,
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

  const compareLabel = (option: any, label: any) => option?.label === label;

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
          // @ts-ignore
          fullSelectOptions.map(option => (
            <MenuItem
              key={option.label}
              value={option.label}
              onClick={event => handleMenuItemClick(event, option)}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexGrow: 1,
                  alignItems: 'center',
                  width: '60%',
                  textOverflow: 'ellipsis',
                }}
              >
                <Typography noWrap sx={{ width: '100%' }}>
                  {option.label}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {compareLabel(option, selectLabel) && <IconCheck />}
              </Box>
            </MenuItem>
          ))}
      </Popover>
    </FormControl>
  );
}

export default CustomSelect;
