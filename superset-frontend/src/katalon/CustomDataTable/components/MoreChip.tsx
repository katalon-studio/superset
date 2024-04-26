/* eslint-disable theme-colors/no-literal-colors */
import { Chip } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import React from 'react';
import { styled } from '@mui/material/styles';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

interface MoreChipProps {
  amount: number;
  tooltipContent: React.ReactNode;
}

const MoreChip = ({ amount, tooltipContent }: MoreChipProps) => (
  <LightTooltip
    title={tooltipContent}
    slotProps={{
      popper: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -10],
            },
          },
        ],
      },
    }}
  >
    <Chip
      sx={{
        marginLeft: '4px',
        fontSize: '10px',
        height: '16px',
        '& span': {
          padding: '0 6px',
        },
      }}
      label={`+${amount}`}
      size="small"
    />
  </LightTooltip>
);

export default MoreChip;
