export class InstallPermissions {
  static readonly type = '[AUTHORIZATION] Install Permissions';
  constructor(public roles: string[]) {}
}

// export class LoadSystemRoles {
//   static readonly type = '[AUTHORIZATION] Load System Roles';
// }

export class SetGrantedRoles {
  static readonly type = '[AUTHORIZATION] Set Granted System Roles';
  constructor(public roles: string[]) {}
}
