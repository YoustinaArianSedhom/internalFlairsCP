export interface MyTicketModel {
  id: string;
  ticketNumber: string;
  category: string;
  departmentName: string;
  accountName: string;
  requested: number;
  hired: number;
  started: number;
  role: string;
  status: string;
  contactName: string;
  ticketURL: string;
  resolution: string;
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
  accountId?: string;
  searchQuery?: string;
  accountName?: string;
  contactName?: string;
  role?: string;
  contactId?: string;
  portfolioId?: string;
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

export interface contactModel {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  webUrl: string;
}

export interface roleModel {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  description: string;
  logoImageLink: string;
}
