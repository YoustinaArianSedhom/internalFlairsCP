import { AssignedPortfolios } from './my-tickets.model';

export const TICKETS_ENDPOINTS_BASE = 'Ticket';
export const Skills_ENDPOINTS_BASE = 'Skill';

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

export const filterSchema: AssignedPortfolios = { id: '', name: 'All' };

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
