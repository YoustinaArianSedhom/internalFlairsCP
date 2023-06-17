import {
  Client,
  Teams,
  Portfolios,
} from '@modules/organization/models/clients.models';

export const Admins_ENDPOINTS_BASE = 'ClientProfile';
export const Internal_Admin_ENDPOINTS_BASE = 'Profile';
export const Clients_ENDPOINTS_BASE = 'account';

export const filterSchema: Client | Teams | Portfolios = {
  id: '',
  name: 'All',
};

export const Roles = [
  { id: '', name: 'All' },
  { id: 0, name: 'Super Admin' },
  { id: 1, name: 'Internal Admin' },
];

export const status = {
  0: 'Inactive',
  1: 'Active',
  2: 'Decommissioned',
};
