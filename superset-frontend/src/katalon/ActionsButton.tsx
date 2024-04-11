import React, { useMemo } from 'react';
import {
  DataMaskState,
  DataMaskStateWithId,
  t,
  isDefined,
} from '@superset-ui/core';
import Button from '@mui/material/Button';
import { FilterBarOrientation } from 'src/dashboard/types';
import { getFilterBarTestId } from 'src/dashboard/components/nativeFilters/FilterBar/utils';
import { Stack } from '@mui/material';

interface ActionButtonsProps {
  width?: number;
  onApply: () => void;
  onClearAll: () => void;
  dataMaskSelected: DataMaskState;
  dataMaskApplied: DataMaskStateWithId;
  isApplyDisabled: boolean;
  filterBarOrientation?: FilterBarOrientation;
}

const ActionButtons = ({
  onApply,
  onClearAll,
  dataMaskApplied,
  dataMaskSelected,
  isApplyDisabled,
}: ActionButtonsProps) => {
  const isClearAllEnabled = useMemo(
    () =>
      Object.values(dataMaskApplied).some(
        filter =>
          isDefined(dataMaskSelected[filter.id]?.filterState?.value) ||
          (!dataMaskSelected[filter.id] &&
            isDefined(filter.filterState?.value)),
      ),
    [dataMaskApplied, dataMaskSelected],
  );

  return (
    <Stack
      sx={{
        marginLeft: 'auto',
        alignItems: 'center',
        marginTop: '35px',
      }}
      direction="row"
      spacing={2}
      data-test="filterbar-action-buttons"
    >
      <Button
        sx={{
          bgcolor: '#2236E5',
          textTransform: 'none',
          fontSize: 14,
          fontWeight: 500,
        }}
        variant="contained"
        disabled={isApplyDisabled}
        disableElevation
        size="small"
        onClick={onApply}
        {...getFilterBarTestId('apply-button')}
      >
        {t('Apply')}
      </Button>
      <Button
        sx={{
          bgcolor: '#F2F3FA',
          color: '#1E30CC',
          textTransform: 'none',
          whiteSpace: 'nowrap',
          fontSize: 14,
          fontWeight: 500,
          '&.MuiButtonBase-root:hover': {
            bgcolor: 'transparent',
          },
        }}
        size="small"
        variant="contained"
        disableElevation
        disabled={!isClearAllEnabled}
        onClick={onClearAll}
        {...getFilterBarTestId('clear-button')}
      >
        {t('Clear all')}
      </Button>
    </Stack>
  );
};

export default ActionButtons;
