import { RecoursesServerConfig } from 'src/app/config/servers.config';
import { environment } from '@environments/environment';
import { OAuthModuleConfig } from 'angular-oauth2-oidc';


export const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: [environment.apiUrl],
    sendAccessToken: true,
  }
};
