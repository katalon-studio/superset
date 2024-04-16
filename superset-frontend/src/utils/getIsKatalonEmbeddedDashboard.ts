import { getUrlParam } from './urlUtils';
import { URL_PARAMS } from '../constants';

export const getIsKatalonEmbeddedDashboard = () =>
  getUrlParam(URL_PARAMS.isKatalonEmbeddedMode);
