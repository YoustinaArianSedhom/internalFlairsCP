export interface ClientsModal {
  id: string;
  name: string;
  description: string;
  key: string;
  logoPath: string;
}

export interface UserModel {
  id: string;
  fullname: string;
  personalEmail: string;
  organizationEmail: string;
  profileImageLink: string;
  title: string;
  createdDate: Date;
  manager: {
    id: string;
    fullName: string;
    organizationEmail: string;
  };
  permissions: string[];
  involvedAccounts: ClientsModal[];
}

export interface userPermissionsBodyModel {
  organizationEmail: string;
  newPermissions: string[];
}

export interface UsersManagementFiltrationModel {
  searchQuery: string;
}
