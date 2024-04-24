/* eslint-disable theme-colors/no-literal-colors */
import React from 'react';
import { getUrlParam } from 'src/utils/urlUtils';
import { URL_PARAMS } from 'src/constants';
import moment from 'moment';
import Config from '../../../config';
import MoreChip from './components/MoreChip';

const MAX_DISPLAY_PER_COLUMN = 2;

interface iconProps {
  src: string;
  size: string;
}

const Icon = ({ src, size }: iconProps) => (
  <img
    style={{
      width: size,
      height: size,
      marginRight: '2px',
    }}
    src={src}
    alt="icon"
  />
);

const statusIconMapper = {
  ERROR: '/static/assets/images/katalon/status-error.svg',
  FAILED: '/static/assets/images/katalon/status-failed.svg',
  IMPORTING: '/static/assets/images/katalon/status-importing.svg',
  INCOMPLETE: '/static/assets/images/katalon/status-incomplete.svg',
  PASSED: '/static/assets/images/katalon/status-passed.svg',
  RUNNING: '/static/assets/images/katalon/status-running.svg',
  SKIPPED: '/static/assets/images/katalon/status-skipped.svg',
  TERMINATE: '/static/assets/images/katalon/status-terminate.svg', // TODO: icon for TERMINATE
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
    return '/static/assets/images/katalon/safari.svg';
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
    <Icon src={statusIconMapper[value]} size="16px" />
  </div>
);

const IDDecorator = (id: string) => {
  const projectId = getUrlParam(URL_PARAMS.projectId);
  const masterAppHost = Config.masterApp;

  return (
    <a
      style={{ color: '#1222a9', fontWeight: 500 }}
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
      <Icon src="/static/assets/images/katalon/profile.svg" size="14px" />
      <span style={{ marginLeft: '4px' }}>{decoratedProfiles}</span>
    </div>
  );
};

const durationDecorator = (milliseconds: number) => {
  let decoratedDuration = moment.utc(milliseconds).format('HH[h] mm[m] ss[s]');
  decoratedDuration = decoratedDuration.replace(/00[hms]/g, '').trim();

  return <span>{decoratedDuration}</span>;
};

const environmentDecorator = (environmentList: any[]) => {
  // TODO - Uncomment this line and remove the mock data
  // if (!environmentList || environmentList.length === 0) return null;

  const list = [
    { os: 'Windows', browser: 'Edge' },
    { os: 'Windows', browser: 'Chrome' },
    { os: 'MacOS', browser: 'Chrome' },
    { os: 'MacOS', browser: 'Edge' },
  ];

  const renderTooltipContent = () => (
    <div>
      {list.slice(MAX_DISPLAY_PER_COLUMN).map(environment => (
        <div style={{ margin: '10px 4px' }}>
          <Icon src={osIconMapper(environment.os)} size="16px" />
          <Icon src={browserIconMapper(environment.browser)} size="16px" />
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      {list.slice(0, 2).map((environment, index) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {index > 0 && index < MAX_DISPLAY_PER_COLUMN && (
            <span style={{ color: '#dbdde5', margin: '0 4px' }}>|</span>
          )}
          <Icon src={osIconMapper(environment.os)} size="16px" />
          <Icon src={browserIconMapper(environment.browser)} size="16px" />
        </div>
      ))}
      {list.length > MAX_DISPLAY_PER_COLUMN && (
        <MoreChip
          amount={list.length - MAX_DISPLAY_PER_COLUMN}
          tooltipContent={renderTooltipContent()}
        />
      )}
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

  const Cell = ({ icon, amount }: { icon: string; amount: number }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '6px',
        width: '50px',
      }}
    >
      <Icon src={icon} size="14px" />
      <span style={{ fontSize: '12px', fontWeight: 500 }}>{amount}</span>
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '4px',
          border: '1px solid #dbdde5',
          overflow: 'hidden',
          height: '26px',
        }}
      >
        <Cell icon={statusIconMapper.PASSED} amount={totalPassed} />
        <div style={{ height: '100%', borderRight: '1px dashed #dbdde5' }} />
        <Cell icon={statusIconMapper.FAILED} amount={totalFailed} />
        <div style={{ height: '100%', borderRight: '1px dashed #dbdde5' }} />
        <Cell icon={statusIconMapper.ERROR} amount={totalError} />
        <div style={{ height: '100%', borderRight: '1px dashed #dbdde5' }} />
        <Cell icon={statusIconMapper.INCOMPLETE} amount={totalIncomplete} />
        <div style={{ height: '100%', borderRight: '1px dashed #dbdde5' }} />
        <Cell icon={statusIconMapper.SKIPPED} amount={totalSkipped} />
      </div>
    </div>
  );
};

const configurationDecorator = (configurationList: string[]) => {
  // TODO - Uncomment this line and remove the mock data
  // if (!configurationList || configurationList.length === 0) return null;

  const list = ['112', '143', '254', '367', '409'];

  const projectId = getUrlParam(URL_PARAMS.projectId);
  const masterAppHost = Config.masterApp;
  const configurationLink = `${masterAppHost}/project/${projectId}/configuration`;

  const renderTooltipContent = () => (
    <div>
      {list.slice(MAX_DISPLAY_PER_COLUMN).map(configuration => (
        <div style={{ margin: '12px 4px' }}>
          <a
            style={{ color: '#1222a9', fontWeight: 500, fontSize: '12px' }}
            href={`${configurationLink}/${configuration}`} // TODO: Update the URL
            target="_blank"
            rel="noreferrer"
          >
            {`#${configuration}`}
          </a>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      {list.slice(0, MAX_DISPLAY_PER_COLUMN).map((configuration, index) => (
        <div>
          {index > 0 && index < MAX_DISPLAY_PER_COLUMN && <span>, </span>}
          <a
            style={{ color: '#1222a9', fontWeight: 500 }}
            href={`${configurationLink}/${configuration}`} // TODO: Update the URL
            target="_blank"
            rel="noreferrer"
          >
            {`#${configuration}`}
          </a>
        </div>
      ))}
      {list.length > MAX_DISPLAY_PER_COLUMN && (
        <MoreChip
          amount={list.length - MAX_DISPLAY_PER_COLUMN}
          tooltipContent={renderTooltipContent()}
        />
      )}
    </div>
  );
};

const executorDecorator = (executor: any) => {
  if (!executor) return null;

  const { name, avatar } = executor;
  // const executorAvatar = avatar
  //   ? `https://katalon-testops-qa-testops-bucket.s3.amazonaws.com/${avatar}` // TODO: Update the URL based on environment
  //   : 'https://katalon-testops.s3.amazonaws.com/image/icon/defaultAvatar.png';

  // TODO: Remove this mock data
  const executorAvatar =
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

export {
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
};
