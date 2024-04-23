/* eslint-disable theme-colors/no-literal-colors */

import React from 'react';
import { DataRecord } from '@superset-ui/core';
import { makeStyles } from '@mui/styles';
import { DataGrid, GridColDef } from '@katalon-studio/katalon-ui/v2';
import { getUrlParam } from 'src/utils/urlUtils';
import { URL_PARAMS } from 'src/constants';
import moment from 'moment';
import { TableChartTransformedProps } from './types';
import { DataTableProps } from './DataTable';
import Config from '../../../../config';

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

const statusIconMapper = {
  PASSED: '/static/assets/images/katalon/status-passed.svg',
  FAILED: '/static/assets/images/katalon/status-failed.svg',
  INCOMPLETE: '/static/assets/images/katalon/status-incomplete.svg',
  ERROR: '/static/assets/images/katalon/status-error.svg',
};

const osIconMapper = (name: string) => {
  if (name.toLowerCase().includes('win')) {
    return '/static/assets/images/katalon/windows.svg';
  }
  if (name.toLowerCase().includes('mac')) {
    return '/static/assets/images/katalon/macos.svg';
  }
  if (name.toLowerCase().includes('linux')) {
    return '/static/assets/images/katalon/linux.svg';
  }
  if (name.toLowerCase().includes('android')) {
    return '/static/assets/images/katalon/macos.svg'; // TODO: icon for Android
  }
  if (name.toLowerCase().includes('ios')) {
    return '/static/assets/images/katalon/macos.svg'; // TODO: icon for IOS
  }
  return '';
};

const browserIconMapper = (name: string) => {
  if (name.toLowerCase().includes('chrome')) {
    return '/static/assets/images/katalon/chrome.svg';
  }
  if (name.toLowerCase().includes('firefox')) {
    return '/static/assets/images/katalon/firefox.svg';
  }
  if (name.toLowerCase().includes('edge')) {
    return '/static/assets/images/katalon/edge.svg';
  }
  if (name.toLowerCase().includes('safari')) {
    return '/static/assets/images/katalon/edge.svg'; // TODO: icon for Safari
  }
  return '';
};

const statusDecorator = (value: string) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}
  >
    <img
      style={{
        width: '14px',
        height: '14px',
      }}
      src={statusIconMapper[value]}
      alt="icon"
    />
  </div>
);

const IDDecorator = (id: string) => {
  const projectId = getUrlParam(URL_PARAMS.projectId);
  const masterAppHost = Config.masterApp;

  return (
    <a
      style={{ marginLeft: '16px', color: 'black' }}
      href={`${masterAppHost}/project/${projectId}/executions/${id}`}
      target="_blank"
      rel="noreferrer"
    >
      {id}
    </a>
  );
};

const nameDecorator = (nameList: string[]) => {
  if (!nameList || nameList.length === 0) return null;

  return (
    <span
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '240px',
      }}
    >
      {nameList[0]}
    </span>
  );
};

const profileDecorator = (profiles: string[]) => {
  if (!profiles || profiles.length === 0) return null;

  const decoratedProfiles = profiles.join(', ');
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        style={{
          width: '16px',
          height: '16px',
          marginRight: '8px',
        }}
        src="/static/assets/images/katalon/profile.svg"
        alt="icon"
      />
      <span>{decoratedProfiles}</span>
    </div>
  );
};

const durationDecorator = (milliseconds: number) => {
  let decoratedDuration = moment.utc(milliseconds).format('HH[h] mm[m] ss[s]');
  decoratedDuration = decoratedDuration.replace(/00[hms]/g, '').trim();

  return <span>{decoratedDuration}</span>;
};

const environmentDecorator = (environmentList: any[]) => {
  if (!environmentList || environmentList.length === 0) return null;

  return (
    <div className="flex">
      {environmentList.map(environment => (
        <div className="flex">
          {environment.os && (
            <img
              style={{
                width: '16px',
                height: '16px',
                marginRight: '2px',
              }}
              src={osIconMapper(environment.os)}
              alt="icon"
            />
          )}
          {environment.browser && (
            <img
              style={{
                width: '16px',
                height: '16px',
              }}
              src={browserIconMapper(environment.browser)}
              alt="icon"
            />
          )}
        </div>
      ))}
    </div>
  );
};

const timeStartedDecorator = (date: Date) => {
  const formattedDate = moment(date).format('DD/MM/YYYY HH:mm');
  return <span>{formattedDate}</span>;
};

const testResultStatusDecorator = (testResultStatus: any) => {
  const {
    totalPassed,
    totalFailed,
    totalError,
    totalIncomplete,
    totalSkipped,
  } = testResultStatus;
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
      }}
    >
      <span>
        {totalPassed} / {totalFailed} / {totalError} / {totalIncomplete} /{' '}
        {totalSkipped}
      </span>
    </div>
  );
};

const configurationDecorator = (configurationList: string[]) => {
  if (!configurationList || configurationList.length === 0) return null;

  const hashedNumbers: string = configurationList
    .map(configuration => `#${configuration}`)
    .join(', ');
  return <span>{hashedNumbers}</span>;
};

const executorDecorator = (executor: any) => {
  if (!executor) return null;

  const { name, avatar } = executor;
  const executorAvatar =
    avatar ||
    'https://katalon-testops.s3.amazonaws.com/image/icon/defaultAvatar.png';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        marginRight: '16px',
      }}
    >
      <img
        style={{ width: '20px', height: '20px' }}
        src={executorAvatar}
        alt="avatar"
      />
      <span style={{ marginLeft: '4px' }}>{name}</span>
    </div>
  );
};

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
  props: TableChartTransformedProps<D> & {
    sticky?: DataTableProps<D>['sticky'];
  },
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
