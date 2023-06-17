import {
  Client,
  Teams,
  Portfolios,
} from '@modules/organization/models/clients.models';

export const Clients_ENDPOINTS_BASE = 'account';
export const Portfolios_ENDPOINTS_BASE = 'Portfolio';
export const Teams_ENDPOINTS_BASE = 'Platform';
export const AssignedProfiles_ENDPOINTS_BASE = 'AssignedProfile';
export const Admins_ENDPOINTS_BASE = 'ClientProfile';

export const filterSchema: Client | Teams | Portfolios = {
  id: '',
  name: 'All',
};

export const status = {
  0: 'Inactive',
  1: 'Active',
  2: 'Decommissioned',
};
