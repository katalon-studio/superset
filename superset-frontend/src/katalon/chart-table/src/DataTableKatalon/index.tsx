import React from 'react';
import { DataGrid, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import CellRenderer from './CellRenderer';
import HeaderRenderer from './HeaderRenderer';
import Row from './Row';

const PAGE_SIZE = 10;

interface DataTableProps<T> {
  rows: GridRowsProp;
  headerRenderer?: HeaderRenderer;
  cellRenderer?: CellRenderer<T>;
  onRowClick?: (item: Row) => void;
  headerStyle?: string;
}

function DataTable<T>(props: DataTableProps<T>) {
  const { rows, headerRenderer, cellRenderer, onRowClick, headerStyle } = props;

  const generateColumns = (rows: GridRowsProp, headerRenderer?: HeaderRenderer, cellRenderer?: CellRenderer<T>) => {
    if (!rows || rows.length === 0) {
      return [];
    }

    // only generate columns that are in the headerRenderer
    let keys;
    if (headerRenderer) {
      keys = Object.keys(rows[0]).filter((key) => headerRenderer[key]);
    } else {
      keys = Object.keys(rows[0]);
    }

    return keys.map((key) => ({
      field: key,
      headerName: headerRenderer ? headerRenderer[key] : key,
      renderCell: (params: GridRenderCellParams) => {
        const cell = params.row[key];
        if (cellRenderer && cellRenderer[key]) {
          return cellRenderer[key](cell);
        }
        return <span>{cell}</span>;
      },
      flex: 1,
      headerClassName: headerStyle ?? '',
    }));
  };

  return (
    <DataGrid
      rows={rows}
      columns={generateColumns(rows, headerRenderer, cellRenderer)}
      getRowId={(row) => row.id}
      onRowClick={(item) => (onRowClick ? onRowClick(item.row) : null)}
      checkboxSelection={false}
      rowSelection={false}
      disableRowSelectionOnClick
      disableColumnMenu
      initialState={{
        pagination: { paginationModel: { pageSize: PAGE_SIZE } },
      }}
      pageSizeOptions={[PAGE_SIZE]}
      hideFooter={rows.length <= PAGE_SIZE}
      autoHeight
    />
  );
}

export default DataTable;
