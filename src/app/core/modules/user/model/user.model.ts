// User information model which must be used as the single trusted reference for logged in user interface

export interface loggedInUserModel {
  profileRoles?: string[];
  id: string;
  fullName: string;
  personalEmail?: string;
  organizationEmail?: string;
  profileImageLink?: string;
  title: string;
  managerId?: string;
  managerFullName?: string;
  managerOrganizationEmail?: string;
  userPermissions?: [];
  permissions?: [];
  roles?: string[];
}

export interface Role {
  roleName: string;
  organizationName: string;
  organizationId: number;
}
export interface ProfileModel {
  id: number;
  name: string;
  organizationEmail: string;
  title: string;
  managerId: number;
  managerName: string;
  nationalId: string;
  medicalInsuranceNumber: string;
  socialInsuranceNumber: string;
  status: number;
  syncedDate: Date;
  submittedDate: Date;
  archivedDate: Date;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  hrCode?: string;
  roles: string[];
}

export const loggedInIdentifier = 'profileId';
