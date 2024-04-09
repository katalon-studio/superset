/* eslint-disable theme-colors/no-literal-colors */
import React, { ReactNode } from 'react';
import styled from 'styled-components';
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
  ${({ isActive, isPlaceholder }) => `
    width: 100%;
    height: 40px;

    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    padding: 0 16px;

    background-color: #FFFFFF;

    border: 1px solid ${isActive ? ACTIVE_COLOR : '#E0E0E0'};
    border-radius: 4px;

    cursor: pointer;

    transition: border-color 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);

    background-color: ${isActive && ACTIVE_COLOR};

    .date-label-content {
      color: ${isPlaceholder ? '#B2B2B2' : '#A7323F'};
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      flex-shrink: 1;
      white-space: nowrap;
      width: 100%;
    }

    span[role='img'] {
      margin-left: auto;
      padding-left: 4px;

      & > span[role='img'] {
        line-height: 0;
      }
    }
  `}
`;

export const DropdownLabel = (props: DropdownLabel) => (
  <LabelContainer {...props} tabIndex={0}>
    <span className="date-label-content">{props.label}</span>
    <KeyboardArrowDownIcon />
  </LabelContainer>
);
