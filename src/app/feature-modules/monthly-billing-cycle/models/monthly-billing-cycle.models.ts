/* _________________________________ MODELS ____________________________*/
export interface MonthlyBillingCycleModel {
   month: number;
   year: number;
   associationCount: number;
   status: Status[];
   amount: Amount[];
   pOs: PO[];
   billableAssociationCount:number;
   nonBillableAssociationCount:number;
}

export interface Amount {
   currency: Currency;
   amount: number;
}

export interface PO {
   id: string;
   number: string;
   amount: number;
   startDate: Date;
   endDate: Date;
   currency: Currency
}

interface Currency {
   id: string;
   name: string;
   symbol: string;
   code: string;
}

export interface Status {
   status: number;
   count: number;
}

export interface MonthlyBillingCycleDetailsModel {
   profileId: string;
   hiringDate: Date;
   terminationDate: Date;
   assignedProfileId: string;
   serviceDescription: Department;
   serviceName: Department;
   serviceStartDate: Date;
   serviceEndDate: Date;
   status: number;
   manager: Manager;
   platform: Platform;
   department: Department;
   resourceName: string;
   resourceOrganizationEmail: string;
   userEmail: string;
   billingRate: number;
   associationNotes: string;
   billingNotes: string;
   poNotes: string;
   poNumber: string;
   workingDays: number;
   amount: number;
   baseAmount:number;
   discountAmount: number;
   discountPercentage: number;
   serviceProvidedOnMonth: number;
   serviceProvidedOnYear: number;
   currency: Currency;
   billingCycleStatus:number;
   hasShortage: boolean;
}

interface Department {
   id: string;
   name: string;
}

interface Manager {
   id: string;
   name: string;
   fullName: string;
   organizationEmail: string;
}

interface Platform {
   id: string;
   name: string;
   portfolio: Portfolio;
}

interface Portfolio {
   id: string;
   name: string;
   account: Department;
}

export interface MonthlyBillingCycleDetailsFiltrationModel {
   month?: number;
   year?: number;
   searchQuery?: string;
   directOnly?: boolean;
}

/* Unassociated Subordinates Models*/
export interface UnassociatedSubsModel {
   name: string;
   title: string;
   manager: string;
   lastAssociatedDate: Date;
   lastAccountName: string;
   lastBillingRate: number;
}
export interface DiscountModel {
   assignedProfileId: string;
   amount: number;
   percentage: number;
  
}
