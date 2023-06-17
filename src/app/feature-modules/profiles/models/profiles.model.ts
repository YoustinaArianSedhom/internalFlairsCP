export interface ProfilesModel {
  id: string;
  fullName: string;
  title: string;
  personalEmail: string;
  organizationEmail: string;
  profileImageLink: string;
  manager: {
    id: string;
    fullName: string;
    organizationEmail: string;
  };
  skillOverallRatings: [
    {
      id: string;
      name: string;
      overallRating: number;
    }
  ];
  assignment: {
    id: string;
    fullName: string;
    title: string;
    profileImageLink: string;
    billingRate: {
      amount: number;
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
export interface MyTeamsFiltrationModel {
  searchQuery?: string;
  types?: number[];
  state?: number;
}

export interface MyTasksActionTaken {
  requestId: string;
  choice: string;
}

export interface RequestTeamModel {
  searchQuery?: string;
  profileAssignFilter?: number;
  profileTypeFilter?: number;
  skillsIds?: string[];
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

export interface Skill {
  id: string;
  name: string;
  keywords: string[];
}
