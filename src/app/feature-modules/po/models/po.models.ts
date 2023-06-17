export class POModel{
    pO_number: string;
    pO_type: string;
    platformId: string;
    managerId: string;
    department:string;
    pO_partner_owner: string;
    pO_partner_email:string;
    pO_start_date:string;
    pO_end_date:string;
    pO_currency:string;
    pO_total_amount:string;
    source:string[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  portfolioId: string;
  portfolioName: string;
  account: {id: string, name: string};
  logo: string;
  logoPath: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  logo: string;
  account:{id:string, name: string};
  logoPath: string;
}

export interface Client {
    id: string;
    name: string;
    description: string;
    key: string;
    logoImageLink: string;
  }
export interface POFiltrationModel {
    searchQuery?: string;
    profileId?: string;
    managerId?: string;
    clientId?: string;
    poId?: string;
    teamId?: string;
    status?: number;
    contractType?: number;
    department?: number;
    skillsIds?: string[];
    PlatformsIds?: string[];
    assignedProfilesManagersIds?: string[];
    assignedProfilesManagers?: any[]
  }

  export interface Departments {
    id: string;
    name: string;
  }

  export interface ExternalAdminModel {
    id: string;
    fullName: string;
    title: string;
    organizationEmail: string;
    clientEmail: string;
    profileImageLink: string;
    feedbackFrequency: FeedbackFrequency;
 }
 export interface FeedbackFrequency {
  weeks: number;
  dayOfWeek: number;
}

export class searchbody{
  searchQuery:string;
}

export interface InternalAdminModel {
  id: string;
  fullName: string;
  title: string;
  name:string;
  personalEmail: string;
  organizationEmail: string;
  profileImageLink: string;
  profileCompletionPercentage: number;
  manager: Manager;
  flairsTechHiringDate: Date;
  skillOverallRatings: any[];
  assignment: null;
}
export interface Manager {
  name: string;
  fullName: string;
  organizationEmail: string;
  id: string;
}
export interface POList{
  id:string;
  number: string;
  account: string;
  portfolio: string;
  platform: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: Currency;
  partnerName: string;
  status:string;
  department:Department;
  manager:InternalAdminModel;
  createdByName:string;
  creatorEmail:string;
  creationDate:string;
}

export interface POListFiltrationModel {
  searchQuery?: string;
  managerEmail?: string;
}

export interface FliterManger{
  platformId:string;
  departments:number;
}

export interface TeamFiltrationModel {
  PortfolioId?: string;
  query?: string;
}

export interface PoModelRecord {
  totalAmount: number;
  number: string;
  partnerName: string;
  partnerEmail: string;
  id: string;
  status: number;
  currency: Currency;
  startDate: string;
  endDate: Date;
  platform: Platform;
  department: Department;
  type:string;
  manager:InternalAdminModel;
  files:File[];
  fileExtension:string;
  isZeroAssociation:boolean;
  isFirstBillingCycleClosed:boolean;
  notes:string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Platform {
  id: string;
  name: string;
  portfolio: Portfolios;
}

export interface Portfolios {
  id: string;
  name: string;
  account: Department;
}

export interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
}

export interface File{
  type?:string;
  fileName:string;
  fileBase64?:string;
  disablePdfIcon?:boolean;
  disableImageIcon?:boolean;
  fileData?:string;
  fileExtension?:string;
  isEditable?: boolean;
}
export interface AssignedProfileRolesModel extends Department { }
export interface LocationsModel extends Department { }
