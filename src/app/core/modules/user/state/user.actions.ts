import { loggedInUserModel } from '../model/user.model';

export class SetUser {
  static readonly type = '[User] Set User';
  constructor(public user: loggedInUserModel) { }
}

export class loadUserInfo {
  static readonly type = '[User] Load info';
}

export class GetUserProperty {
  static readonly type = '[User] Get User Property';
  constructor(public propertyName: string) {}
}


export class UpdateUserProperty {
  static readonly type = '[User] Update User Property';
  constructor(public property: string, public value: string) {}
}

export class UpdateRoles {
  static readonly type = '[User] Update User Roles';
  constructor(public roles: string[]) {}
}
export class GetMyProfileDetails {
  static readonly type = '[User] Get Profile Details';
  constructor() {}
}

export class ResetUserInfo {
  static readonly type = '[User] Reset User Info';
}
