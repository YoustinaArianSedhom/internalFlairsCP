export interface MyTeamModel {
  id: string;
  fullName: string;
  title: string;
  profileImageLink: string;
  billingRate: 0;
  hiringDate: string;
  leavingDate: string;
  serviceStartDate: Date;
  profile: {
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
      flairsTechHiringDate: string;
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
}

interface MyTasksIssuerModel {
  fullName: string;
  organizationEmail: string;
}

interface MyTasksTargetEmployee {
  fullName: string;
  organizationEmail: string;
}
interface MyTasksTaskNoteModel {
  priority: number;
  note: string;
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
  platformsIds?: string[];
  status?: number;
  skillsIds?: string[];
}

export interface AssignedPortfolios {
  id: string;
  name: string;
  description?: string;
  portfolioId?: string;
  portfolioName?: string;
  account?: {id: string, name: string};
  logo?: string;
  logoPath?: string;
}

export interface Skill {
  id: string;
  name: string;
  keywords: string[];
}

export interface Skill {
  id: string;
  name: string;
  keywords: string[];
}
