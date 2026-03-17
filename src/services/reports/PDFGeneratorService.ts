import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import type { Document } from '@react-pdf/renderer';
import type { DonationReportData, CampaignReportData, Language, ReportTranslations } from '@/types/reports';
import { DonationReportTemplate } from '@/components/reports/DonationReportTemplate';
import { CampaignReportTemplate } from '@/components/reports/CampaignReportTemplate';
import { translations } from '@/lib/i18n';

/**
 * Locale configuration for currency and date formatting per language
 */
const LOCALE_MAP: Record<Language, string> = {
  en: 'en-US',
  sv: 'sv-SE',
  ar: 'ar-SA',
};

/**
 * PDFGeneratorService handles PDF generation for donation and campaign reports.
 * This class provides utility methods for locale-aware formatting and report ID generation.
 */
export class PDFGeneratorService {
  /**
   * Format a currency amount according to the selected language locale.
   * - English (en): USD 1,234.56 style (en-US conventions)
   * - Swedish (sv): 1 234,56 kr style (sv-SE conventions)
   * - Arabic (ar): Arabic-Indic numerals with locale-appropriate separators
   *
   * @param amount - The numeric amount to format
   * @param currency - ISO 4217 currency code (e.g. 'USD', 'SEK', 'SAR')
   * @param language - Target language locale
   * @returns Formatted currency string
   */
  formatCurrency(amount: number, currency: string, language: Language): string {
    const locale = LOCALE_MAP[language];
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Format a date according to the selected language locale.
   * - English (en): MM/DD/YYYY (en-US conventions)
   * - Swedish (sv): YYYY-MM-DD (sv-SE conventions)
   * - Arabic (ar): DD/MM/YYYY with Arabic-Indic numerals (ar-SA conventions)
   *
   * @param date - The date to format
   * @param language - Target language locale
   * @returns Formatted date string
   */
  formatDate(date: Date, language: Language): string {
    const locale = LOCALE_MAP[language];
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }

  /**
   * Generate a unique report identifier.
   * Format: RPT-{timestamp}-{random6hex}
   * Example: RPT-1704067200000-a3f9c1
   *
   * @returns Unique report ID string
   */
  generateReportId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0');
    return `RPT-${timestamp}-${random}`;
  }

  /**
   * Build a ReportTranslations object from the i18n translations for the given language.
   */
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

  /**
   * Generate a donation report PDF from the given data.
   * Integrates DonationReportTemplate with @react-pdf/renderer.
   * Supports multi-page reports and RTL layout for Arabic.
   *
   * @param data - The donation report data
   * @param language - Target language for the report
   * @returns PDF as a Buffer
   */
  async generateDonationPDF(data: DonationReportData, language: Language): Promise<Buffer> {
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

  /**
   * Generate a campaign report PDF from the given data.
   * Integrates CampaignReportTemplate with @react-pdf/renderer.
   * Supports multi-page reports and RTL layout for Arabic.
   *
   * @param data - The campaign report data
   * @param language - Target language for the report
   * @returns PDF as a Buffer
   */
  async generateCampaignPDF(data: CampaignReportData, language: Language): Promise<Buffer> {
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
