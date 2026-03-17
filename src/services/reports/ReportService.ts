import { prisma } from '@/lib/prisma';
import type { 
  ValidationResult, 
  CurrencyTotal,
  ContributionRow,
  CampaignFilters,
  CampaignStats,
  ContributionSummary,
  AggregateStatistics
} from '@/types/reports';

/**
 * ReportService handles querying and processing data for donation and campaign reports
 */
export class ReportService {
  /**
   * Query contributions for a specific user with optional date range filtering
   * @param userId - The ID of the user whose contributions to query
   * @param startDate - Optional start date for filtering (inclusive)
   * @param endDate - Optional end date for filtering (inclusive)
   * @returns Array of contribution rows with campaign and beneficiary details
   */
  async queryUserContributions(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ContributionRow[]> {
    // Build the where clause for date filtering
    const whereClause: any = {
      userId,
    };

    // Add date range filtering if provided
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = startDate;
      }
      if (endDate) {
        whereClause.createdAt.lte = endDate;
      }
    }

    // Query contributions with related campaign and beneficiary data
    const contributions = await prisma.contribution.findMany({
      where: whereClause,
      include: {
        campaign: {
          include: {
            beneficiary: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Sort by date descending (most recent first)
      },
    });

    // Transform to ContributionRow format
    return contributions.map((contribution) => ({
      date: contribution.createdAt,
      campaignName: contribution.campaign.title,
      beneficiaryName: contribution.campaign.beneficiary.name,
      amount: contribution.amount,
      currency: contribution.currency,
    }));
  }

  /**
   * Validate that a date range is valid
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   * @returns ValidationResult indicating if the range is valid
   */
  validateDateRange(
    startDate?: Date,
    endDate?: Date
  ): ValidationResult {
    // If both dates are provided, ensure start is not after end
    if (startDate && endDate && startDate > endDate) {
      return {
        isValid: false,
        error: 'Start date must be before or equal to end date',
      };
    }

    return {
      isValid: true,
    };
  }

  /**
   * Calculate total amounts grouped by currency
   * @param contributions - Array of contribution rows
   * @returns Array of currency totals
   */
  calculateCurrencyTotals(contributions: ContributionRow[]): CurrencyTotal[] {
    // Group contributions by currency and sum amounts
    const totalsMap = contributions.reduce((acc, contribution) => {
      const currency = contribution.currency;
      if (!acc[currency]) {
        acc[currency] = 0;
      }
      acc[currency] += contribution.amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format
    return Object.entries(totalsMap).map(([currency, total]) => ({
      currency,
      total,
    }));
  }

  /**
   * Query campaigns with optional filtering
   * @param filters - Campaign filters (status, group, date range, specific IDs)
   * @returns Array of campaigns with statistics
   */
  async queryCampaigns(filters: CampaignFilters): Promise<CampaignStats[]> {
    // Build the where clause for filtering
    const whereClause: any = {};

    // Filter by specific campaign IDs if provided
    if (filters.campaignIds && filters.campaignIds.length > 0) {
      whereClause.id = { in: filters.campaignIds };
    }

    // Filter by status if provided
    if (filters.status) {
      whereClause.status = filters.status;
    }

    // Filter by group if provided
    if (filters.groupId) {
      whereClause.groupId = filters.groupId;
    }

    // Filter by date range if provided (campaign start date)
    if (filters.startDate || filters.endDate) {
      whereClause.createdAt = {};
      if (filters.startDate) {
        whereClause.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        whereClause.createdAt.lte = filters.endDate;
      }
    }

    // Query campaigns with related data
    const campaigns = await prisma.campaign.findMany({
      where: whereClause,
      include: {
        beneficiary: {
          select: {
            name: true,
          },
        },
        contributions: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate statistics for each campaign
    return campaigns.map((campaign) => 
      this.calculateCampaignStats(campaign)
    );
  }

  /**
   * Calculate statistics for a single campaign
   * @param campaign - Campaign data with contributions
   * @returns Campaign statistics
   */
  calculateCampaignStats(campaign: any): CampaignStats {
    const contributions = campaign.contributions || [];

    // Calculate unique contributor count
    const uniqueContributorIds = new Set(
      contributions.map((c: any) => c.userId)
    );
    const contributorCount = uniqueContributorIds.size;

    // Calculate average contribution
    const totalAmount = contributions.reduce(
      (sum: number, c: any) => sum + c.amount,
      0
    );
    const averageContribution = 
      contributions.length > 0 ? totalAmount / contributions.length : 0;

    // Calculate funding percentage
    const fundingPercentage = 
      campaign.targetAmount > 0 
        ? (campaign.currentAmount / campaign.targetAmount) * 100 
        : 0;

    // Transform contributions to summary format
    const contributionSummaries: ContributionSummary[] = contributions.map(
      (c: any) => ({
        date: c.createdAt,
        contributorName: c.user.name,
        amount: c.amount,
        isAnonymous: false, // Default to false for now
      })
    );

    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      beneficiaryName: campaign.beneficiary.name,
      targetAmount: campaign.targetAmount,
      currentAmount: campaign.currentAmount,
      currency: campaign.currency,
      status: campaign.status,
      startDate: campaign.createdAt,
      endDate: campaign.updatedAt, // Using updatedAt as endDate for now
      contributorCount,
      averageContribution,
      fundingPercentage,
      contributions: contributionSummaries,
    };
  }

  /**
   * Calculate aggregate statistics across multiple campaigns
   * @param campaigns - Array of campaign statistics
   * @returns Aggregate statistics
   */
  calculateAggregateStats(campaigns: CampaignStats[]): AggregateStatistics {
    // Total number of campaigns
    const totalCampaigns = campaigns.length;

    // Total number of contributions across all campaigns
    const totalContributions = campaigns.reduce(
      (sum, campaign) => sum + campaign.contributions.length,
      0
    );

    // Total amount across all campaigns (assuming same currency or need conversion)
    const totalAmount = campaigns.reduce(
      (sum, campaign) => sum + campaign.currentAmount,
      0
    );

    // Average campaign size (average current amount per campaign)
    const averageCampaignSize = 
      totalCampaigns > 0 ? totalAmount / totalCampaigns : 0;

    // Unique contributors across all campaigns
    const allContributorNames = new Set<string>();
    campaigns.forEach((campaign) => {
      campaign.contributions.forEach((contribution) => {
        if (!contribution.isAnonymous) {
          allContributorNames.add(contribution.contributorName);
        }
      });
    });
    const uniqueContributors = allContributorNames.size;

    return {
      totalCampaigns,
      totalContributions,
      totalAmount,
      averageCampaignSize,
      uniqueContributors,
    };
  }
}
