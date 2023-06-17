export enum roleMode {
  All = '',
  superAdmin = 0,
  internalAdmin = 1,
}

export interface Client {
  id: string;
  name: string;
  description?: string;
  key?: string;
  logoImageLink?: string;
  portfolios?: Portfolios[];
  isExpanded?: boolean;
}

export interface ClientPart {
  id: string;
  name: string;
}

export interface Portfolios {
  id: string;
  name: string;
  description?: string;
  logoImageLink?: string;
  client: ClientPart;
}

export interface PortfolioPart {
  id: string;
  name: string;
}

export interface Teams {
  id: string;
  name: string;
  description?: string;
  logoImageLink?: string;
  portfolio: PortfolioPart;
  account:{id: string, name: string}
}

export interface GetMyTeamsFilteration {
  accountId?: string;
  PortfolioId?: string;
}

export interface Filtration {
  searchQuery?: string;
  clientId?: string | any;
  portfolioId?: string;
  teamId?: string;
  teamsIds?: string[];
}

export interface InternalAdminsFiltration {
  searchQuery?: string;
  role?: string;
  teamsIds?: string[];
}

export interface Admin {
  id: string;
  fullName: string;
  title: string;
  organizationEmail: string;
  clientEmail: string;
  profileImageLink: string;
}

export interface InternalAdmin {
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
    team: {
      id: string;
      name: string;
      portfolio: {
        id: string;
        name: string;
        client: {
          id: string;
          name: string;
        };
      };
    };
  };
}
