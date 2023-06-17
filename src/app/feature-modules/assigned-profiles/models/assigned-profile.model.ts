export interface ProfilesModel {
  id: string;
  fullName: string;
  externalEmployeeEmail: string;
  title: string;
  profileImageLink: string;
  billingRate: 0;
  serviceEndDate: Date;
  serviceStartDate: Date;
  poNumber: string;
  contractType: string;
  isIncludedInClosedBillingCycle: boolean;
  department: { id: string; name: string };
  profile: {
    id: string;
    fullName: string;
    title: string;
    personalEmail: string;
    organizationEmail: string;
    profileImageLink: string;
    flairsTechHiringDate: Date;
    manager: {
      id: string;
      fullName: string;
      organizationEmail: string;
    };
    skillOverallRatings: [
      {
        id: string;
        name: string;
        overallRating: 0;
      }
    ];
    assignment: {
      id: string;
      fullName: string;
      title: string;
      profileImageLink: string;
      billingRate: {
        amount: 0;
        encrypted: string;
      };
      hiringDate: string;
      leavingDate: string;
      manager: {
        id: string;
        name: string;
        organizationEmail: string;
      };
      platform: {
        id: string;
        name: string;
        portfolio: {
          id: string;
          name: string;
          account: {
            id: string;
            name: string;
          };
        };
      };
    };
  };
  manager: {
    id: string;
    name: string;
    organizationEmail: string;
  };
  platform: {
    id: string;
    name: string;
    portfolio: {
      id: string;
      name: string;
      account: {
        id: string;
        name: string;
      };
    };
  };
  status: 0;
  terminationReason: { id: string; name: string };
  voluntaryLeave: { id: string; name: string };
  turnoverType: { id: string; name: string }[];
  role: { id: string; name: string };
  location: { id: string; name: string };
  isEndAssociationDataEditable :boolean;
}

export interface AssignmentModel {
  id: string;
  fullName: string;
  title: string;
  profileImageLink: string;
  billingRate: MonthlyCostModel;
}

export interface MonthlyCostModel {
  amount: number;
  encrypted: string;
}

export interface ManagerModel {
  id: string;
  name: string;
  organizationEmail: string;
}

export interface TeamModel {
  id: string;
  name: string;
  portfolio: PortfolioModel;
}

export interface PortfolioModel {
  id: string;
  name: string;
  client: ClientModel;
}

export interface ClientModel {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  description: string;
  key: string;
  logoImageLink: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  logo: string;
  account: { id: string, name: string };
  logoPath: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  portfolioId: string;
  portfolioName: string;
  account: { id: string, name: string };
  logo: string;
  logoPath: string;
}

export interface MyTeamsFiltrationModel {
  searchQuery?: string;
  types?: number[];
  state?: number;
}

export interface AssignedProfileFiltrationModel {
  searchQuery?: string;
  profileId?: string;
  managerId?: string;
  clientId?: string;
  portfolioId?: string;
  teamId?: string;
  status?: number;
  contractType?: number;
  department?: number;
  skillsIds?: string[];
  PlatformsIds?: string[];
  assignedProfilesManagersIds?: string[];
  assignedProfilesManagers?: any[]
}

export interface MyTasksActionTaken {
  requestId: string;
  choice: string;
}

export interface RequestTeamModel {
  searchQuery?: string;
  profileAssignFilter?: number;
  profileTypeFilter?: number;
}

export interface AssignedPortfolios {
  id: string;
  name: string;
  description?: string;
  portfolioId?: string;
  portfolioName?: string;
  clientName?: string;
  clientId?: string;
  logo?: string;
  logoPath?: string;
}

export interface AdvancedSelectConfig {
  display: string | any;
  binder: string | any;
  multiple: boolean;
  placeholder?: string;
  loading?: boolean;
  loadingText?: string;
  searchable?: boolean;
  serverSideSearch?: boolean;
  searchHandler?: (term: string) => void;
  searchText?: string;
  customValue?: boolean;
  customValueText?: string;
  minTermLength?: number;
}

export interface Skill {
  id: string;
  name: string;
  keywords: string[];
}

export interface GetMyTeamsFilteration {
  accountId?: string;
  PortfolioId?: string;
  teamId?: string;
  department?: number,
  status?: number,
  contractType?: number
}

export interface EndAssociationModel {
  id: string;
  serviceEndDate: Date;
  isDoneWithClient: boolean;
  turnoverType?: number[];
  terminationReason?: number;
  voluntaryLeave?: number;
}
export interface EditEndAssociationModel {
  id:string;
  isDoneWithClient:boolean;
  turnoverType:number[];
  terminationReason:number;
  voluntaryLeave:number;
}
export interface Departments {
  id: string;
  name: string;
}

export interface ExcelErrors {
  recordsValidationResults: RecordsValidationResults[];
  workSheetName: string
}


export interface RecordsValidationResults {
  recordIndex: number;
  key: string;
  messages: string[];
  workSheetName: string;
}

export interface POModel {
  id: string;
  number: string;
  manager: Manager;
  platform: Platform;
  department: Department;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  currency: number;
  partnerName: string;
  partnerEmail: string;
  status: number;
  type: number;
}

export interface Department {
  id: string;
  name: string;
}

export interface Manager {
  id: string;
  name: string;
  fullName: string;
  organizationEmail: string;
}

export interface Platform {
  id: string;
  name: string;
  portfolio: Portfolio;
}

export interface Portfolio {
  id: string;
  name: string;
  account: Department;
}

export interface ChangeContractTypeBodyModel{
  id: string;
  billingRate?: number;
}
