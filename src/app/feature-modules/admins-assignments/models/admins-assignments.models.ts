export interface adminModel {
   id: string;
   clientProfile: ClientProfile;
   profile: Profile;
   accountsIds: any[];
   portfoliosIds: any[];
   platformsIds: any[];
   createdDate: Date;
}

export interface ClientProfile {
   id: string;
   fullName: string;
   title: string;
   clientEmail: string;
}

export interface Profile {
   id: string;
   fullName: string;
   organizationEmail: string;
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

export interface InternalAdminModel {
   id: string;
   fullName: string;
   title: string;
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

export interface adminAssignmentFormBodyModel {
   clientProfileId?: string;
   profileId?: string;
   accountsIds?: string[];
   portfoliosIds?: string[];
   platformsIds?: string[];
}
