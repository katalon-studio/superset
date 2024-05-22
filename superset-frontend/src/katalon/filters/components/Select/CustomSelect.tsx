/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { Box, MenuItem, Typography } from '@mui/material';
import React, { useState } from 'react';
import IconCheck from '@mui/icons-material/Check';
import styled from 'styled-components';
import { PopoverFilter } from '@katalon-studio/katalon-ui/v2';

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

const LabelContainer = styled.span<{}>`
  ${() => `
    margin-top: -8px;
    .MuiInputBase-input {
      width: 80%;
    }
    fieldset {
      top: 0px;
      legend {
        display: none;
      }
    }
  `}
`;

function CustomSelect(props: CustomSelectProps) {
  const { selectLabel, fullSelectOptions, handleMenuItemClick } = props;

  const [open, setOpen] = useState<boolean>(false);

  const compareLabel = (option: any, label: any) => option?.label === label;

  const overlayContent = (
    <>
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
    </>
  );

  return (
    <LabelContainer>
      <PopoverFilter
        label={selectLabel}
        overlayContent={overlayContent}
        open={open}
        setOpen={setOpen}
      />
    </LabelContainer>
  );
}

export default CustomSelect;
