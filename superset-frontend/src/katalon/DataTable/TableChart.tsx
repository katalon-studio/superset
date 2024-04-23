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
      ...rest,
      configuration: parsedConfiguration,
      profile: parsedProfile,
      environment: parsedEnvironment,
      name,
      executor: parsedExecutor,
      test_result_status: parsedTestResultStatus,
    };
  });

export default function TableChart<D extends DataRecord = DataRecord>(
  props: TableChartTransformedProps<D>,
) {
  // TODO: Only use the decorators for test_run_data_table_dataset dataset

  const classes = useStyles();

  const { data } = props;
  console.log('data', data);

  const formattedData = formatData(data);
  console.log('FORMATTED DATA', formattedData);

  const tableColumns: GridColDef[] = [
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 0.2,
      headerAlign: 'center',
      headerClassName: classes.tableHeader,
      renderCell: cell => statusDecorator(cell.value),
    },
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.3,
      headerClassName: classes.firstColumnHeader,
      renderCell: cell => IDDecorator(cell.value),
    },
    {
      field: 'name',
      headerName: 'NAME',
      flex: 1.3,
      headerClassName: classes.tableHeader,
      renderCell: cell => nameDecorator(cell.value),
    },
    {
      field: 'profile',
      headerName: 'PROFILE',
      flex: 0.5,
      headerClassName: classes.tableHeader,
      renderCell: cell => profileDecorator(cell.value),
    },
    {
      field: 'duration',
      headerName: 'DURATION',
      flex: 0.5,
      headerClassName: classes.tableHeader,
      renderCell: cell => durationDecorator(cell.value),
    },
    {
      field: 'environment',
      headerName: 'ENVIRONMENT',
      flex: 0.5,
      headerClassName: classes.tableHeader,
      renderCell: cell => environmentDecorator(cell.value),
    },
    {
      field: 'time_started',
      headerName: 'TIME STARTED',
      flex: 0.5,
      headerClassName: classes.tableHeader,
      renderCell: cell => timeStartedDecorator(cell.value),
    },
    {
      field: 'test_result_status',
      headerName: 'TEST RESULT STATUS',
      flex: 0.7,
      headerClassName: classes.tableHeader,
      renderCell: cell => testResultStatusDecorator(cell.value),
    },
    {
      field: 'configuration',
      headerName: 'CONFIGURATION',
      flex: 0.6,
      headerClassName: classes.tableHeader,
      renderCell: cell => configurationDecorator(cell.value),
    },
    {
      field: 'executor',
      headerName: 'EXECUTOR',
      flex: 0.5,
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
      rowHeight={40}
      columnHeaderHeight={40}
      rows={formattedData}
      columns={tableColumns}
      pageSizeOptions={[PAGE_SIZE]}
      hideFooter={formattedData.length <= PAGE_SIZE}
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
}
