/**
 * TypeScript types for donation report generation feature
 */

// API Request/Response Types

export interface DonationReportRequest {
  startDate?: string; // ISO 8601 date string (optional)
  endDate?: string; // ISO 8601 date string (optional)
  language?: 'en' | 'sv' | 'ar'; // Default: user's preference
}

export interface CampaignReportRequest {
  campaignIds?: string[]; // Optional: specific campaigns (empty = all)
  groupId?: string; // Optional: filter by family group
  status?: 'active' | 'completed' | 'cancelled'; // Optional
  startDate?: string; // Optional: campaign start date filter
  endDate?: string; // Optional: campaign end date filter
  language?: 'en' | 'sv' | 'ar'; // Default: user's preference
}

// Report Data Types

export interface DonationReportData {
  reportId: string;
  generatedAt: Date;
  user: {
    name: string;
    email: string;
  };
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  contributions: ContributionRow[];
  totals: CurrencyTotal[];
  disclaimer: string;
}

export interface ContributionRow {
  date: Date;
  campaignName: string;
  beneficiaryName: string;
  amount: number;
  currency: string;
}

export interface CurrencyTotal {
  currency: string;
  total: number;
}

export interface CampaignReportData {
  reportId: string;
  generatedAt: Date;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  campaigns: CampaignStats[];
  aggregateStats: AggregateStatistics;
}

export interface CampaignStats {
  id: string;
  title: string;
  description: string;
  beneficiaryName: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  contributorCount: number;
  averageContribution: number;
  fundingPercentage: number;
  contributions: ContributionSummary[];
}

export interface ContributionSummary {
  date: Date;
  contributorName: string;
  amount: number;
  isAnonymous: boolean;
}

export interface AggregateStatistics {
  totalCampaigns: number;
  totalContributions: number;
  totalAmount: number;
  averageCampaignSize: number;
  uniqueContributors: number;
}

// Utility Types

export type Language = 'en' | 'sv' | 'ar';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface DonationReportOptions {
  startDate?: Date;
  endDate?: Date;
  language: Language;
}

export interface CampaignReportOptions {
  campaignIds?: string[];
  groupId?: string;
  status?: 'active' | 'completed' | 'cancelled';
  startDate?: Date;
  endDate?: Date;
  language: Language;
}

export interface CampaignFilters {
  campaignIds?: string[];
  groupId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

// Error Types

export interface ReportError {
  error: string;
  message: string;
  code: string;
  details?: Record<string, any>;
  suggestion?: string;
  requiredRole?: string;
  requestId?: string;
}

// Translation Types

export interface ReportTranslations {
  title: string;
  organizationName: string;
  reportId: string;
  generatedAt: string;
  dateRange: string;
  memberName: string;
  memberEmail: string;
  contributions: string;
  date: string;
  campaign: string;
  beneficiary: string;
  amount: string;
  currency: string;
  total: string;
  disclaimer: string;
  campaignTitle: string;
  description: string;
  targetAmount: string;
  currentAmount: string;
  status: string;
  startDate: string;
  endDate: string;
  contributors: string;
  averageContribution: string;
  fundingPercentage: string;
  aggregateStats: string;
  totalCampaigns: string;
  totalContributions: string;
  totalAmount: string;
  averageCampaignSize: string;
  uniqueContributors: string;
  page: string;
  of: string;
}
