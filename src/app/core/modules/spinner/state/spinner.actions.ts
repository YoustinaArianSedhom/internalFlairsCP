export class ShowSpinner {
  static readonly type = '[Spinner] Show';
  constructor() { }
}


export class HideSpinner {
  static readonly type = '[Spinner] Hide';
  constructor() { }
}

export class DeactivateSpinner {
  static readonly type = '[Spinner] Deactivate';
}

export class ActivateSpinner {
  static readonly type = '[Spinner] Activate';
}

export class RegisterExcludedUrls {
  static readonly type = '[Spinner] Register Excluded Urls';
  constructor(public excludedUrls: string[]) {}
}
