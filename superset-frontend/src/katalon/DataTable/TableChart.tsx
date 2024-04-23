/* eslint-disable theme-colors/no-literal-colors */

import React from 'react';
import { DataRecord } from '@superset-ui/core';
import { makeStyles } from '@mui/styles';
import { DataGrid, GridColDef } from '@katalon-studio/katalon-ui/v2';
import { TableChartTransformedProps } from './types';
import {
  statusDecorator,
  IDDecorator,
  nameDecorator,
  profileDecorator,
  durationDecorator,
  environmentDecorator,
  timeStartedDecorator,
  testResultStatusDecorator,
  configurationDecorator,
  executorDecorator,
} from './TestRunDecorators';

const useStyles = makeStyles(() => ({
  tableHeader: {
    backgroundColor: '#f7f9fb',
    '& .MuiDataGrid-columnHeaderTitle': {
      color: '#46474d',
      fontSize: '11px',
      fontWeight: 700,
    },
  },
  firstColumnHeader: {
    backgroundColor: '#f7f9fb',
    '& .MuiDataGrid-columnHeaderTitle': {
      color: '#46474d',
      fontSize: '11px',
      fontWeight: 700,
      paddingLeft: '16px',
    },
  },
  lastColumnHeader: {
    backgroundColor: '#f7f9fb',
    '& .MuiDataGrid-columnHeaderTitle': {
      color: '#46474d',
      fontSize: '11px',
      fontWeight: 700,
      paddingRight: '16px',
    },
  },
}));

const PAGE_SIZE = 10;

const formatData = (data: any) =>
  data.map((row: any) => {
    const {
      configuration,
      profile,
      environment,
      executor,
      test_result_status,
      run_configuration_name,
      test_suite_collection_name,
      test_suite_name,
      ...rest
    } = row;

    const parseJSON = (value: any) => {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error(error);
        return value;
      }
    };

    const parsedConfiguration = parseJSON(configuration);
    const parsedProfile = parseJSON(profile);
    const parsedEnvironment = parseJSON(environment);
    const parsedExecutor = parseJSON(executor);
    const parsedTestResultStatus = parseJSON(test_result_status);

    let name: string[] = [];
    if (run_configuration_name) {
      name = parseJSON(run_configuration_name);
    } else if (test_suite_collection_name) {
      name = parseJSON(test_suite_collection_name);
    } else if (test_suite_name) {
      name = parseJSON(test_suite_name);
    }

    return {
      configuration: parsedConfiguration,
      profile: parsedProfile,
      environment: parsedEnvironment,
      name,
      executor: parsedExecutor,
      test_result_status: parsedTestResultStatus,
      ...rest,
    };
  });

export default function TableChart<D extends DataRecord = DataRecord>(
  props: TableChartTransformedProps<D>,
) {
  // TODO: Only use the decorators for Test Run v2 dataset

  const classes = useStyles();

  const { data } = props;
  console.log('data', data);

  const rows = formatData(data);
  console.log('rows', rows);

  const columns: GridColDef[] = [
    {
      field: 'status',
      headerName: 'STATUS',
      width: 60,
      headerAlign: 'center',
      headerClassName: classes.tableHeader,
      renderCell: cell => statusDecorator(cell.value),
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
      headerClassName: classes.firstColumnHeader,
      renderCell: cell => IDDecorator(cell.value),
    },
    {
      field: 'name',
      headerName: 'NAME',
      width: 320,
      headerClassName: classes.tableHeader,
      renderCell: cell => nameDecorator(cell.value),
    },
    {
      field: 'profile',
      headerName: 'PROFILE',
      width: 150,
      headerClassName: classes.tableHeader,
      renderCell: cell => profileDecorator(cell.value),
    },
    {
      field: 'duration',
      headerName: 'DURATION',
      width: 100,
      headerClassName: classes.tableHeader,
      renderCell: cell => durationDecorator(cell.value),
    },
    {
      field: 'environment',
      headerName: 'ENVIRONMENT',
      width: 150,
      headerClassName: classes.tableHeader,
      renderCell: cell => environmentDecorator(cell.value),
    },
    {
      field: 'time_started',
      headerName: 'TIME STARTED',
      width: 150,
      headerClassName: classes.tableHeader,
      renderCell: cell => timeStartedDecorator(cell.value),
    },
    {
      field: 'test_result_status',
      headerName: 'TEST RESULT STATUS',
      width: 280,
      headerClassName: classes.tableHeader,
      renderCell: cell => testResultStatusDecorator(cell.value),
    },
    {
      field: 'configuration',
      headerName: 'CONFIGURATION',
      width: 150,
      headerClassName: classes.tableHeader,
      renderCell: cell => configurationDecorator(cell.value),
    },
    {
      field: 'executor',
      headerName: 'EXECUTOR',
      width: 170,
      headerClassName: classes.lastColumnHeader,
      renderCell: cell => executorDecorator(cell.value),
    },
  ];

  return (
    <DataGrid
      sx={{
        fontFamily: 'Inter',
        '.MuiDataGrid-columnHeaderTitleContainer': {
          backgroundColor: '#f7f9fb',
        },
      }}
      initialState={{
        pagination: { paginationModel: { pageSize: PAGE_SIZE } },
      }}
      rowHeight={42}
      columnHeaderHeight={42}
      rows={rows}
      columns={columns}
      pageSizeOptions={[PAGE_SIZE]}
      hideFooter={rows.length <= PAGE_SIZE}
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
}
