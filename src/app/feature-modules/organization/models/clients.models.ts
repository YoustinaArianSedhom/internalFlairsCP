export interface Client {
  id: string;
  name: string;
  description?: string;
  key?: string;
  logoImageLink?: string;
  portfolios?: Portfolios[];
  account?: {
    id: string,
    name: string
  };
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
  platform?:{account?:ClientPart};
  account?: ClientPart;
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
  portfolio?: PortfolioPart;
  account?: ClientPart;
}

export interface Department {
  id: string;
  name: string;
}

export interface Filtration {
  searchQuery?: string;
  accountId?: string | any;
  portfolioId?: string;
  teamId?: string;
  PlatformsIds?: string[];
  department?: number;
}

export interface Entities {
  accountsCount: number;
  portfoliosCount: number;
  platformsCount: number;
}

export interface Admin {
  id: string;
  fullName: string;
  title: string;
  organizationEmail: string;
  clientEmail: string;
  profileImageLink: string;
}

export interface AssignedProfile {
  id: string;
  fullName: string;
  title: string;
  profileImageLink: string;
  billingRate: number;
  hiringDate: string;
  leavingDate: string;
  department:{id:string;name:string};
  location:{id:string;name:string};
  role:{id:string;name:string};
  profile: {
    id: string;
    fullName: string;
    title: string;
    personalEmail: string;
    organizationEmail: string;
    profileImageLink: string;
    flairsTechHiringDate:string;
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
  status: number;
}

export interface Tree {
  id: string;
  name: string;
  portfolios: [
    {
      id: string;
      name: string;
      platforms: [
        {
          id: string;
          name: string;
        }
      ];
    }
  ];
}

export interface DepartmentBreadcrumb {
  id: string;
  name: string;
  platform?: {
    id: string;
    name: string;
    portfolio: { id: string; name: string, account?: { id: string; name: string }; };
  };
}
export const FREQUENCY_FEEDBACK_OPTIONS = [
  {
    id: 0,
    name: 'None'
  },
  {
    id: 1,
    name: 'Recurrent'
  }
]

export const FREQUENCY_FEEDBACK_DATE_OPTIONS = [
  {
    id: 0,
    name: 'weeks'
  }
]


export const DAYS_OF_WEEKS_OPTIONS = [
  {
    id:0,
    name:'Sunday'
  },
  {
    id:1,
    name:'Monday'
  },
  {
    id:2,
    name:'Tuesday'
  },
  {
    id:3,
    name:'Wednesday'
  },
  {
    id:4,
    name:'Thursday'
  },
  {
    id:5,
    name:'Friday'
  },
  {
    id:6,
    name:'Saturday'
  },
]
// export interface filtrationAssignedProfile {
//   searchQuery: string;
//   profileId: string;
//   skillsIds: string[];
//   managerId: string;
//   clientId: string;
//   portfolioId: string;
//   teamId: string;
//   status: number;
// }
