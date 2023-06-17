export interface OrgModel {
    key: string,
    name: string,
    logoPath: string,
    business: string,
    website: string,
    contactNumber: string,
    addresses: { name: string; description: string }[],
    domains: string[]
}

export interface OrgEntityModel {
    id?: number;
    profileId?: number;
    name: string;
    countryId: number;
    status?: number;
    value?: string;
    currency?: number;
    createdDate?: Date,
    createdBy: string,
    monthlyMinimumGrossSalaryForSocialInsurance?: number;
    monthlyMaximumGrossSalaryForSocialInsurance?: number;
    socialInsurancePercentage?: number;
    yearlyPersonalExemption?: number

}

export interface OrgSalaryLevelModel {
    id?: number;
    name: string;
    from: number;
    to: number;
    description: string;
}