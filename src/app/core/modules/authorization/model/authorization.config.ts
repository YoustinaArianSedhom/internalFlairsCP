// List of roles to be used as the single trusted reference for all available roles cross over the whole system
export enum SystemRoles {
  Master = 'Master',
  CreateRaise = 'Create Raise',
  CreatePromotion = 'Create Promotion',
  workflowManagement = 'Workflow Management',
  PermissionManagement = 'Permission Management',
  createChangeManager = 'Create Change Management',
  createVoucherRequest = 'Create Voucher',
  createReferralRequest = 'Create Referral Bonus',

  SuperAdmin = 'Super Admin',
  ExternalAdmin = 'External Admin',
  InternalAdmin = 'Internal Admin',

  Employee = 'Employee',
  Manager = 'Manager',
  PayrollManager = 'Payroll Manager',
}

export const ROLES_key = 'profileRoles';
