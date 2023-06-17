export interface ApiResponse<T = any> {
  status: boolean;
  result: T;
  errorMessage: string;
  errors: string[];
}

export interface LoginResponse {
  token: string;
  isSuperAdmin: boolean;
  isVerifiedEmail: boolean;
  expiration: string;
  fullName?: string;
  loggedInWithActiveDirectory?: boolean;
  profileId?: string;
}

export interface PaginationModel<T = any> {
  pageNumber: number;
  pageSize: number;
  pagesTotalCount: number;
  records: T[];
  recordsTotalCount: number;
}
