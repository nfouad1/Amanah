import React from 'react';
import type { DonationReportData, CampaignReportData, Language, ReportTranslations } from '@/types/reports';
import { translations } from '@/lib/i18n';

/**
 * Locale configuration for currency and date formatting per language
 */
const LOCALE_MAP: Record<Language, string> = {
  en: 'en-US',
  sv: 'sv-SE',
  ar: 'ar-SA',
};

export class PDFGeneratorService {
  formatCurrency(amount: number, currency: string, language: Language): string {
    const locale = LOCALE_MAP[language];
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  formatDate(date: Date, language: Language): string {
    const locale = LOCALE_MAP[language];
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }

  generateReportId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0');
    return `RPT-${timestamp}-${random}`;
  }

  private buildTranslations(language: Language): ReportTranslations {
    const t = translations[language];
    return {
      title: t.reportTitle,
      organizationName: t.reportOrganizationName,
      reportId: t.reportId,
      generatedAt: t.reportGeneratedAt,
      dateRange: t.reportDateRange,
      memberName: t.reportMemberName,
      memberEmail: t.reportMemberEmail,
      contributions: t.reportContributions,
      date: t.reportDate,
      campaign: t.reportCampaign,
      beneficiary: t.reportBeneficiary,
      amount: t.reportAmount,
      currency: t.reportCurrency,
      total: t.reportTotal,
      disclaimer: t.reportDisclaimer,
      campaignTitle: t.reportCampaignTitle,
      description: t.reportDescription,
      targetAmount: t.reportTargetAmount,
      currentAmount: t.reportCurrentAmount,
      status: t.reportStatus,
      startDate: t.reportStartDate,
      endDate: t.reportEndDate,
      contributors: t.reportContributors,
      averageContribution: t.reportAverageContribution,
      fundingPercentage: t.reportFundingPercentage,
      aggregateStats: t.reportAggregateStats,
      totalCampaigns: t.reportTotalCampaigns,
      totalContributions: t.reportTotalContributions,
      totalAmount: t.reportTotalAmount,
      averageCampaignSize: t.reportAverageCampaignSize,
      uniqueContributors: t.reportUniqueContributors,
      page: t.reportPage,
      of: t.reportOf,
    };
  }

  async generateDonationPDF(data: DonationReportData, language: Language): Promise<Buffer> {
    // Dynamic imports to avoid bundling @react-pdf/renderer at build time
    const { renderToBuffer } = await import('@react-pdf/renderer');
    const { DonationReportTemplate } = await import('@/components/reports/DonationReportTemplate');

    const reportTranslations = this.buildTranslations(language);
    const isRTL = language === 'ar';

    const formatCurrency = (amount: number, currency: string) =>
      this.formatCurrency(amount, currency, language);
    const formatDate = (date: Date) => this.formatDate(date, language);

    const element = React.createElement(DonationReportTemplate, {
      data,
      translations: reportTranslations,
      isRTL,
      formatCurrency,
      formatDate,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return renderToBuffer(element as any);
  }

  async generateCampaignPDF(data: CampaignReportData, language: Language): Promise<Buffer> {
    // Dynamic imports to avoid bundling @react-pdf/renderer at build time
    const { renderToBuffer } = await import('@react-pdf/renderer');
    const { CampaignReportTemplate } = await import('@/components/reports/CampaignReportTemplate');

    const reportTranslations = this.buildTranslations(language);
    const isRTL = language === 'ar';

    const formatCurrency = (amount: number, currency: string) =>
      this.formatCurrency(amount, currency, language);
    const formatDate = (date: Date) => this.formatDate(date, language);

    const element = React.createElement(CampaignReportTemplate, {
      data,
      translations: reportTranslations,
      isRTL,
      formatCurrency,
      formatDate,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return renderToBuffer(element as any);
  }
}
