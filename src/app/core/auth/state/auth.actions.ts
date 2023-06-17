export class Login {
  static readonly type = '[Auth] User Login';
  constructor(public url?: string) {}
}

export class Logout {
  static readonly type = '[Auth] User Logout';
}


// export class LogoutOrderFromClient {
//   static readonly type = "[Auth] Logout Order From Client";
// }

// export class LogoutOrderFromServer {
//   static readonly type = '[Auth] Logout Order From Server';
// }

export class NotifyAllOriginContextsToLogout {
  static readonly type = '[Auth] NotifyAllOriginContextsToLogout';
}
export class NotifyAllOriginContextsToLogin {
  static readonly type = '[Auth] NotifyAllOriginContextsToLogin';
}

export class RefreshToken {
  static readonly type = '[Auth] Refresh Token';
}


export class NavigateTargetRoute {
  static readonly type = '[Auth] Navigate Target Route';
  constructor(public route?: string) {}
}


export class SetReturnUrl {
  static readonly type = '[Auth] Set Return URL';
  constructor(public route?: string) {}
}

export class RemoveReturnUrl {
  static readonly type = '[Auth] Remove Return URL';
}


export class CacheLastDispatchedAction {
  static readonly type = '[Auth] Cache Last Dispatched Action';
  constructor(public action: object) {}
}