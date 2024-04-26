import { KATALON_URL_PARAMS } from 'src/katalon/Constant';
import { getUrlParam } from './urlUtils';

export const getIsKatalonEmbeddedDashboard = () =>
  // @ts-ignore
  getUrlParam(KATALON_URL_PARAMS.isKatalonEmbeddedMode);

export const getKatalonProjectId = () =>
  // @ts-ignore
  getUrlParam(KATALON_URL_PARAMS.projectId);

export const getKatalonIsMetric = () =>
  // @ts-ignore
  getUrlParam(KATALON_URL_PARAMS.isMetric);
