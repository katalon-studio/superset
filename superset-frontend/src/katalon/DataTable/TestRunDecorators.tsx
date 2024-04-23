/* eslint-disable theme-colors/no-literal-colors */

import React from 'react';
import { getUrlParam } from 'src/utils/urlUtils';
import { URL_PARAMS } from 'src/constants';
import moment from 'moment';
import Config from '../../../config';

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
  // if (!environmentList || environmentList.length === 0) return null;

  const list = [
    { os: 'Windows', browser: 'Edge' },
    { os: 'Windows', browser: 'Chrome' },
    { os: 'MacOS', browser: 'Chrome' },
  ];

  return (
    <div style={{ display: 'flex' }}>
      {list.slice(0, 2).map((environment, index) => (
        <div>
          {index === 1 && <span>|</span>}
          <img
            style={{
              width: '16px',
              height: '16px',
              marginRight: '2px',
            }}
            src={osIconMapper(environment.os)}
            alt="icon"
          />
          <img
            style={{
              width: '16px',
              height: '16px',
            }}
            src={browserIconMapper(environment.browser)}
            alt="icon"
          />
        </div>
      ))}
      {list.length > 2 && <span>+{list.length - 2}</span>}
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
  const executorAvatar = avatar
    ? `https://katalon-testops-qa-testops-bucket.s3.amazonaws.com/${avatar}` // TODO: Update the URL based on environment
    : 'https://katalon-testops.s3.amazonaws.com/image/icon/defaultAvatar.png';

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
