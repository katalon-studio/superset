import { ReactNode } from 'react';

interface CellRenderer<T> {
  [key: string]: (cell: T) => ReactNode;
}

export default CellRenderer;
