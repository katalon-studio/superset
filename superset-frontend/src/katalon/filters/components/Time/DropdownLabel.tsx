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

const LabelContainer = styled.div<{
  isActive?: boolean;
  isPlaceholder?: boolean;
}>`
  ${({ isActive, isPlaceholder }) => `
    min-width: 190px;
    height: 40px;

    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    padding: 0 8px 0 12px;

    background-color: #FFFFFF;

    border: 1px solid ${isActive ? '#0F1866' : '#dbdde5'};
    border-radius: 4px;

    cursor: pointer;

    transition: border-color 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);

    background-color: ${isActive && '#F2F3FA'};

    .date-label-content {
      color: ${isPlaceholder ? '#B2B2B2' : '#000000'};
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      flex-shrink: 1;
      white-space: nowrap;
      width: 100%;
    }

    svg {
      font-size: 25px;
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
