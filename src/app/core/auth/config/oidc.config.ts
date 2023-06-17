import { SSAConfigInst } from 'src/app/config/app.config';
import { environment } from '@environments/environment';
import { AuthConfig } from 'angular-oauth2-oidc';
export const authConfig: AuthConfig = {
  issuer: `${environment.stsUrl}/tenants/flairstech`,
  clientId: 'flairs_clients_app_web',
  responseType: 'code',
  redirectUri: `${window.location.origin}/`,
  postLogoutRedirectUri: `${window.location.origin}${SSAConfigInst.ROUTES_CONFIG.login}/`,
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  scope: 'openid profile offline_access flairs_clients_app_api_flairstech',
  // Ask offline_access to support refresh token refreshes
  useSilentRefresh: false,
  // silentRefreshTimeout: 30 * 1000,
  // silentRefreshMessagePrefix: 'Payroll',
  // silentRefreshShowIFrame: true,
  oidc: true,
  requireHttps: 'remoteOnly',
  sessionChecksEnabled: false,
  // sessionCheckIntervall: 40 * 1000,
  showDebugInformation: !environment.disableLogs, // Also requires enabling "Verbose" level in devtools
  clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
  nonceStateSeparator: 'semicolon', // Real semicolon gets mangled by IdentityServer's URI encoding
};
