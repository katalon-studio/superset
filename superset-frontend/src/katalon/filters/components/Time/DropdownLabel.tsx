import React, { forwardRef, ReactNode, RefObject } from 'react';
import { css, styled, useTheme } from '@superset-ui/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export type DropdownLabel = {
  label: ReactNode;
  isActive?: boolean;
  isPlaceholder?: boolean;
  onClick?: (event: React.MouseEvent) => void;
};

const ACTIVE_COLOR = '#1718191A';

const LabelContainer = styled.div<{
  isActive?: boolean;
  isPlaceholder?: boolean;
}>`
  ${({ theme, isActive, isPlaceholder }) => css`
    width: 100%;
    height: ${theme.gridUnit * 10}px;

    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    padding: 0 ${theme.gridUnit * 4}px;

    background-color: ${theme.colors.grayscale.light5};

    border: 1px solid ${isActive ? ACTIVE_COLOR : theme.colors.grayscale.light2};
    border-radius: ${theme.borderRadius}px;

    cursor: pointer;

    transition: border-color 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
    :hover {
      background-color: ${ACTIVE_COLOR};
    }

    background-color: ${isActive && ACTIVE_COLOR};

    .date-label-content {
      color: ${isPlaceholder
        ? theme.colors.grayscale.light1
        : theme.colors.grayscale.dark1};
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      flex-shrink: 1;
      white-space: nowrap;
      width: 100%;
    }

    span[role='img'] {
      margin-left: auto;
      padding-left: ${theme.gridUnit}px;

      & > span[role='img'] {
        line-height: 0;
      }
    }
  `}
`;

export const DropdownLabel = forwardRef(
  (props: DropdownLabel, ref: RefObject<HTMLSpanElement>) => {
    const theme = useTheme();
    return (
      <LabelContainer {...props} tabIndex={0}>
        <span className="date-label-content" ref={ref}>
          {props.label}
        </span>
        <KeyboardArrowDownIcon />
      </LabelContainer>
    );
  },
);
