/* eslint-disable theme-colors/no-literal-colors */
import React from 'react';
import moment from 'moment';
import { getKatalonProjectId } from 'src/utils/getKatalonParams';
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
  INCOMPLETE: '/static/assets/images/katalon/status-incomplete.svg', // TODO: icon for INCOMPLETE
  PASSED: '/static/assets/images/katalon/status-passed.svg',
  RUNNING: '/static/assets/images/katalon/status-running.svg',
  SKIPPED: '/static/assets/images/katalon/status-skipped.svg',
  TERMINATE: '/static/assets/images/katalon/status-terminate.svg',
};

const osIconMapper = (name: string) => {
  if (name.toLowerCase().includes('win')) {
    return '/static/assets/images/katalon/os-windows.svg';
  }
  if (name.toLowerCase().includes('mac')) {
    return '/static/assets/images/katalon/os-macos.svg';
  }
  if (name.toLowerCase().includes('linux')) {
    return '/static/assets/images/katalon/os-linux.svg';
  }
  if (name.toLowerCase().includes('android')) {
    return '/static/assets/images/katalon/os-android.svg';
  }
  if (name.toLowerCase().includes('ios')) {
    return '/static/assets/images/katalon/os-ios.svg';
  }
  return '/static/assets/images/katalon/undetected.svg';
};

const browserIconMapper = (name: string) => {
  if (name.toLowerCase().includes('chrome')) {
    return '/static/assets/images/katalon/browser-chrome.svg';
  }
  if (name.toLowerCase().includes('firefox')) {
    return '/static/assets/images/katalon/browser-firefox.svg';
  }
  if (name.toLowerCase().includes('edge')) {
    return '/static/assets/images/katalon/browser-edge.svg';
  }
  if (name.toLowerCase().includes('safari')) {
    return '/static/assets/images/katalon/browser-safari.svg';
  }
  return '/static/assets/images/katalon/undetected.svg';
};

const statusDecorator = (value: string) => {
  if (!value) return <span>N/A</span>;

  return (
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
};

const IDDecorator = (id: string) => {
  if (!id) return <span>N/A</span>;

  const projectId = getKatalonProjectId();
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
  if (!nameList || nameList.length === 0) return <span>N/A</span>;

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

const profileDecorator = (profileList: string[]) => {
  if (
    !profileList ||
    profileList.length === 0 ||
    profileList.every(item => !item)
  ) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <div style={{ marginRight: '4px' }}>
          <Icon src="/static/assets/images/katalon/profile.svg" size="16px" />
        </div>
        <span>N/A</span>
      </div>
    );
  }

  const renderTooltipContent = () => (
    <div>
      {profileList.slice(MAX_DISPLAY_PER_COLUMN).map(profile => (
        <div style={{ margin: '12px 4px' }}>
          <span style={{ fontSize: '12px' }}>{profile}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <div style={{ marginRight: '4px' }}>
        <Icon src="/static/assets/images/katalon/profile.svg" size="16px" />
      </div>
      {profileList.slice(0, MAX_DISPLAY_PER_COLUMN).map((profile, index) => (
        <div>
          {index > 0 && index < MAX_DISPLAY_PER_COLUMN && <span>, </span>}
          <span>{profile}</span>
        </div>
      ))}
      {profileList.length > MAX_DISPLAY_PER_COLUMN && (
        <MoreChip
          amount={profileList.length - MAX_DISPLAY_PER_COLUMN}
          tooltipContent={renderTooltipContent()}
        />
      )}
    </div>
  );
};

const durationDecorator = (milliseconds: number) => {
  if (!milliseconds) return <span>N/A</span>;

  let decoratedDuration = moment.utc(milliseconds).format('HH[h] mm[m] ss[s]');
  decoratedDuration = decoratedDuration.replace(/00[hms]/g, '').trim();
  if (decoratedDuration === '') {
    decoratedDuration = '0s';
  }
  return <span>{decoratedDuration}</span>;
};

const environmentDecorator = (environmentList: any[]) => {
  if (
    !environmentList ||
    environmentList.length === 0 ||
    environmentList.every(item => !item.os && !item.browser)
  ) {
    return <span>N/A</span>;
  }

  const renderTooltipContent = () => (
    <div>
      {environmentList.slice(MAX_DISPLAY_PER_COLUMN).map(environment => (
        <div style={{ margin: '10px 4px' }}>
          <Icon src={osIconMapper(environment.os)} size="16px" />
          <Icon src={browserIconMapper(environment.browser)} size="16px" />
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      {environmentList.slice(0, 2).map((environment, index) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {index > 0 && index < MAX_DISPLAY_PER_COLUMN && (
            <span style={{ color: '#dbdde5', margin: '0 4px' }}>|</span>
          )}
          {environment.os && (
            <Icon src={osIconMapper(environment.os)} size="16px" />
          )}
          {environment.device && (
            <Icon src="/static/assets/images/katalon/mobile.svg" size="16px" />
          )}
          {environment.browser && (
            <Icon src={browserIconMapper(environment.browser)} size="16px" />
          )}
        </div>
      ))}
      {environmentList.length > MAX_DISPLAY_PER_COLUMN && (
        <MoreChip
          amount={environmentList.length - MAX_DISPLAY_PER_COLUMN}
          tooltipContent={renderTooltipContent()}
        />
      )}
    </div>
  );
};

const timeStartedDecorator = (date: Date) => {
  if (!date) return <span>N/A</span>;

  const formattedDate = moment(date).format('DD/MM/YYYY HH:mm');
  return <span>{formattedDate}</span>;
};

const testResultStatusDecorator = (testResultStatus: any) => {
  if (!testResultStatus) return <span>N/A</span>;

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
  if (!configurationList || configurationList.length === 0) {
    return <span>N/A</span>;
  }

  const projectId = getKatalonProjectId();
  const masterAppHost = Config.masterApp;
  const configurationLink = `${masterAppHost}/project/${projectId}/configuration`;

  const renderTooltipContent = () => (
    <div>
      {configurationList.slice(MAX_DISPLAY_PER_COLUMN).map(configuration => (
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
      {configurationList
        .slice(0, MAX_DISPLAY_PER_COLUMN)
        .map((configuration, index) => (
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
      {configurationList.length > MAX_DISPLAY_PER_COLUMN && (
        <MoreChip
          amount={configurationList.length - MAX_DISPLAY_PER_COLUMN}
          tooltipContent={renderTooltipContent()}
        />
      )}
    </div>
  );
};

const executorDecorator = (executor: any) => {
  if (!executor) return <span>N/A</span>;

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
