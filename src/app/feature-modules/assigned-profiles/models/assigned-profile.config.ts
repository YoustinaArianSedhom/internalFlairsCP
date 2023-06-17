import {
  PortfolioModel,
  ProfilesModel,
  TeamModel,
} from '@modules/assigned-profiles/models/assigned-profile.model';

export const TEAMS_ENDPOINTS_BASE = 'AssignedProfile';
export const PROFILE_ENDPOINTS_BASE = 'Profile';
export const CLIENTS_ENDPOINTS_BASE = 'Client';
export const PORTFOLIOS_ENDPOINTS_BASE = 'Portfolio';
export const TEAM_ENDPOINTS_BASE = 'Platform';
export const LOOKUP_ENDPOINTS_BASE = 'Lookup';




export const REQUEST_TYPES_CONFIG = {
  0: 'Raise',
  1: 'Promotion',
  2: 'HR Letter',
  3: 'Change Management',
  4: 'Voucher',
  5: 'Referral Bonus',
};

export const REQUESTS_TYPES_OPTIONS = [
  {
    id: 0,
    name: 'Raise',
  },
  {
    id: 1,
    name: 'Promotion',
  },
  {
    id: 2,
    name: 'HR Letter',
  },
  {
    id: 3,
    name: 'Change Management',
  },
  {
    id: 4,
    name: 'Voucher',
  },
  {
    id: 5,
    name: 'Referral Bonus',
  },
];

export const TEAMS_STATUS_OPTIONS = [
  {
    id: -5,
    name: 'All',
  },
  {
    id: 0,
    name: 'Inactive',
  },
  {
    id: 1,
    name: 'Active',
  },
  {
    id: 2,
    name: 'Decommissioned',
  },
];

export const status = {
  0: 'Inactive',
  1: 'Active',
  2: 'Decommissioned',
  3: 'Created'
};

export const statusArray = [
  { id: '', name: 'All' },
  { id: 0, name: 'Inactive' },
  { id: 1, name: 'Active' },
  { id: 2, name: 'Decommissioned' },
  { id: 3, name: 'Created'}
];

export const contractTypeArray = [
  {
    id: '',
    name: 'All',
  },
  {
    id: 0,
    name: 'Billable',
  },
  {
    id: 1,
    name: 'Non-billable',
  },
];

export const departmentArray = [
  {
    id: 4,
    name: 'All',
  },
  {
    id: 0,
    name: 'BPO',
  },
  {
    id: 1,
    name: 'CSR',
  },
  {
    id: 2,
    name: 'Accounting',
  },
  {
    id: 3,
    name: 'R&D',
  },
];

export const departmentNames = ['BPO', 'CSR', 'Accounting', 'R&D'];
export const ContractTypesNames = ['Billable', 'Non-billable'];

export const Portfolio = [
  {
    id: 0,
    name: 'All',
  },
  {
    id: 1,
    name: 'P1 Valsoft',
  },
  {
    id: 2,
    name: 'P2 Valsoft',
  },
  {
    id: 3,
    name: 'P2 Valsoft',
  },
  {
    id: 4,
    name: 'P3 Valsoft',
  },
];

export const enum TASKS_STATUS_ENUM {
  Active = 'Approved',
  Rejected = 'Rejected',
  Applied = 'Applied',
}

export const filterSchema: any = {
  id: '',
  name: 'All',
};
export const EMPLOYEE_LEAVE = [
  {
    id: false,
    name: 'No',
  },
   { 
    id: true, 
    name: 'Yes', 
  }]
  export const TURN_OVER_TYPES =[
    {
      id: 0,
      name: 'Upgrade turnover',
      note: 'Low Performers (Involuntarily - we ask them to leave)'
    },
    {
      id: 1, name: 'Passed 3 months turnover',
      note: 'Passed 3 months with this account/product'
    },
    {
      id: 2,
      name: 'Protected turnover',
      note: 'No PO Loss and we got it covered',
    }];

