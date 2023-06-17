import { RecoursesServerConfig, STSServerConfig } from 'src/app/config/servers.config';

export const environment = {
  production: true,
  apiUrl: RecoursesServerConfig.STAGING_APIs_URL,
  stsUrl: STSServerConfig.STAGING_URL,
  version: 'CUS-0.0.1',
  disableLogs: false,
};
