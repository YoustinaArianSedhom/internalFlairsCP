export interface BillingCycleModel {
   name: string;
   month: number;
   year: number;
   amount: number;
   poNumber: string;
   poManagerName: string;
   poManagerEmail: string;
   poPartnerOwner: string;
   poPartnerEmail: string;
   id: string;
   status: number;
   currency: Currency;
   poStartDate: Date;
   poEndDate: Date;
   platform: Platform;
   department: Department;
   hasShortage: boolean;
}

export interface BillingCycleDetailsModel {
   profileId: string;
   assignedProfileId: string;
   resourceName: string;
   resourceOrganizationEmail: string;
   userEmail: string;
   billingRate: number;
   notes: string;
   poNumber: string;
   workingDays: number;
   amount: number;
   baseAmount:number;
   discountAmount: number;
   discountPercentage: number;
   hiringDate: Date;
   terminationDate: Date;
   role: Department;
   serviceName: Department;
   serviceLevel: Department;
   serviceStartDate: Date;
   serviceEndDate: Date;
   status: number;
   platform: Platform;
   department: Department;
   currency: Currency;
   billingCycleStatus:number;
   hasShortage: boolean;
}

export interface BillingCycleDetailsFiltrationModel{
   billingCycleId: string;
   searchQuery: string;
}

interface Department {
   id: string;
   name: string;
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

interface Currency {
   id: string;
   name: string;
   symbol: string;
   code: string;
}
export interface DiscountModel {
   assignedProfileId: string;
   amount: number;
   percentage: number;
  
}